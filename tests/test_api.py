"""Integration tests for ComfyUI-Libretto aiohttp REST API."""

import json
import os
import shutil
import sys
import tempfile
import unittest

# Ensure project root is in sys.path when test is executed directly
pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

try:
    # pyrefly: ignore[missing-import]
    from aiohttp import web
    # pyrefly: ignore[missing-import]
    from aiohttp.test_utils import AioHTTPTestCase
    # pyrefly: ignore[missing-import]
    from libretto.api import register_api_routes
    HAS_AIOHTTP = True
except ImportError:
    HAS_AIOHTTP = False
    web = None  # type: ignore
    AioHTTPTestCase = unittest.TestCase  # type: ignore
    register_api_routes = None  # type: ignore

# pyrefly: ignore[missing-import]
from libretto.repository import LibraryRepository


@unittest.skipUnless(HAS_AIOHTTP, "aiohttp is required for API integration tests")
class TestLibrettoApi(AioHTTPTestCase):
    async def get_application(self):
        self.temp_dir = tempfile.mkdtemp(prefix="libretto_api_test_")
        self.repo = LibraryRepository(self.temp_dir)
        app = web.Application()
        register_api_routes(app, self.repo)
        return app

    async def tearDownAsync(self):
        if hasattr(self, "client") and self.client:
            await self.client.close()
        await super().tearDownAsync()
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    async def test_health_endpoint(self):
        resp = await self.client.request("GET", "/libretto/api/v1/health")
        self.assertEqual(resp.status, 200)
        data = await resp.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["api_version"], "1.0.0")
        self.assertEqual(data["schema_version"], 1)

    async def test_crud_endpoints(self):
        # 1. Create entry
        create_payload = {
            "title": "API Test Workflow",
            "summary": "Testing REST API",
            "tags": ["api", "testing"],
            "workflow": {
                "format": "comfyui-json",
                "data": {
                    "nodes": [
                        {"id": 1, "type": "KSampler"},
                        {"id": 2, "type": "LibrettoInput", "widgets_values": ["steps", "INT", 20]},
                    ]
                },
            },
        }
        res_create = await self.client.request(
            "POST",
            "/libretto/api/v1/entries",
            data=json.dumps(create_payload),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res_create.status, 201)
        created_json = await res_create.json()
        entry = created_json["entry"]
        entry_id = entry["id"]
        content_hash = entry["content_hash"]
        self.assertEqual(entry["title"], "API Test Workflow")
        self.assertEqual(len(entry["interfaces"]["inputs"]), 1)

        # 2. Get entry
        res_get = await self.client.request("GET", f"/libretto/api/v1/entries/{entry_id}")
        self.assertEqual(res_get.status, 200)
        get_json = await res_get.json()
        self.assertEqual(get_json["entry"]["id"], entry_id)

        # 3. List entries
        res_list = await self.client.request("GET", "/libretto/api/v1/entries?q=API")
        self.assertEqual(res_list.status, 200)
        list_json = await res_list.json()
        self.assertEqual(list_json["total"], 1)

        # 4. Update entry with optimistic lock
        res_update = await self.client.request(
            "PUT",
            f"/libretto/api/v1/entries/{entry_id}",
            data=json.dumps({"title": "Updated API Title"}),
            headers={"Content-Type": "application/json", "If-Match": content_hash},
        )
        self.assertEqual(res_update.status, 200)
        updated_json = await res_update.json()
        self.assertEqual(updated_json["entry"]["title"], "Updated API Title")

        # 5. Export entry
        res_export = await self.client.request("GET", f"/libretto/api/v1/export/{entry_id}")
        self.assertEqual(res_export.status, 200)
        export_json = await res_export.json()
        self.assertEqual(export_json["package_format"], "libretto-package")
        self.assertEqual(export_json["entry"]["title"], "Updated API Title")

        # 6. Delete entry
        res_delete = await self.client.request("DELETE", f"/libretto/api/v1/entries/{entry_id}")
        self.assertEqual(res_delete.status, 204)

        # 7. Verify deletion
        res_get_again = await self.client.request("GET", f"/libretto/api/v1/entries/{entry_id}")
        self.assertEqual(res_get_again.status, 404)

    async def test_scan_workflow_endpoint(self):
        scan_payload = {
            "data": {
                "nodes": [
                    {"id": 10, "type": "VAEDecode"},
                    {"id": 11, "type": "SaveImage"},
                    {"id": 12, "type": "LibrettoOutput", "widgets_values": ["output_img", "final image"]},
                ]
            }
        }
        res = await self.client.request(
            "POST",
            "/libretto/api/v1/scan_workflow",
            data=json.dumps(scan_payload),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res.status, 200)
        data = await res.json()
        self.assertIn("VAEDecode", data["node_classes"])
        self.assertIn("SaveImage", data["node_classes"])
        self.assertEqual(len(data["outputs"]), 1)
        self.assertEqual(data["outputs"][0]["name"], "output_img")

    async def test_upload_preview_and_export_all(self):
        # Create an entry first
        res_create = await self.client.request(
            "POST",
            "/libretto/api/v1/entries",
            data=json.dumps({"title": "Preview Test Workflow"}),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res_create.status, 201)
        created = await res_create.json()
        entry_id = created["entry"]["id"]

        # Upload base64 preview
        fake_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        res_preview = await self.client.request(
            "POST",
            f"/libretto/api/v1/entries/{entry_id}/preview",
            data=json.dumps({"image_base64": fake_b64}),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res_preview.status, 200)
        prev_json = await res_preview.json()
        self.assertTrue(prev_json["preview"].startswith("assets/"))

        # Verify serving the asset
        asset_fn = prev_json["preview"].replace("assets/", "")
        res_asset = await self.client.request("GET", f"/libretto/api/v1/assets/{asset_fn}")
        self.assertEqual(res_asset.status, 200)
        self.assertEqual(res_asset.headers["Content-Type"], "image/png")

        # Test bulk export zip
        res_zip = await self.client.request("GET", "/libretto/api/v1/export_all")
        self.assertEqual(res_zip.status, 200)
        self.assertEqual(res_zip.headers["Content-Type"], "application/zip")
        body = await res_zip.read()
        self.assertTrue(len(body) > 100)

    async def test_import_endpoint_dry_run(self):
        pkg = {
            "package_format": "libretto-package",
            "package_version": "1.0.0",
            "entry": {
                "schema_version": 1,
                "title": "Importable Package",
                "version": "1.0.0",
                "workflow": {"format": "comfyui-json", "data": {}},
            },
        }
        res = await self.client.request(
            "POST",
            "/libretto/api/v1/import?dry_run=true",
            data=json.dumps(pkg),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res.status, 200)
        data = await res.json()
        self.assertTrue(data["dry_run"])
        self.assertTrue(data["valid"])
        self.assertEqual(data["entry_preview"]["title"], "Importable Package")

    async def test_profiles_and_categories_endpoints(self):
        resp = await self.client.request("GET", "/libretto/api/v1/profiles")
        self.assertEqual(resp.status, 200)
        data = await resp.json()
        self.assertIn("profiles", data)
        profile_ids = [p["id"] for p in data["profiles"]]
        self.assertIn("sdxl", profile_ids)
        self.assertIn("pony", profile_ids)
        self.assertIn("flux", profile_ids)

        c_resp = await self.client.request("GET", "/libretto/api/v1/categories")
        self.assertEqual(c_resp.status, 200)
        c_data = await c_resp.json()
        self.assertIn("categories", c_data)

    async def test_compile_preview_endpoint(self):
        payload = {
            "profile_id": "sdxl",
            "components": [
                {"name": "Heroine", "category": "character", "keywords": "1girl, silver hair"},
                {"name": "Night City", "category": "environment", "keywords": "cyberpunk city, rain"},
            ],
            "extra_positive": "masterpiece",
        }
        res = await self.client.request(
            "POST",
            "/libretto/api/v1/compile_preview",
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(res.status, 200)
        result = await res.json()
        self.assertIn("positive", result)
        self.assertIn("negative", result)
        self.assertIn("1girl", result["positive"])
        self.assertIn("cyberpunk city", result["positive"])

    async def test_presets_and_tags_endpoints(self):
        resp = await self.client.request("GET", "/libretto/api/v1/presets")
        self.assertEqual(resp.status, 200)
        data = await resp.json()
        self.assertIn("items", data)
        self.assertIn("total", data)

        tags_resp = await self.client.request("GET", "/libretto/api/v1/tags")
        self.assertEqual(tags_resp.status, 200)
        tags_data = await tags_resp.json()
        self.assertIn("tags", tags_data)

        # Test thumbnail serving by category, by folder, and direct
        t1 = await self.client.request("GET", "/libretto/api/v1/presets/thumb/character/p-046f9ebb")
        self.assertEqual(t1.status, 200)
        self.assertEqual(t1.headers.get("Content-Type"), "image/webp")
        body1 = await t1.read()
        self.assertTrue(len(body1) > 100)

        t2 = await self.client.request("GET", "/libretto/api/v1/presets/thumb/characters/p-046f9ebb")
        self.assertEqual(t2.status, 200)

        t3 = await self.client.request("GET", "/libretto/api/v1/presets/thumb/p-046f9ebb")
        self.assertEqual(t3.status, 200)

    async def test_custom_preset_lifecycle_and_packs(self):
        # 1. Create a custom preset
        new_preset = {
            "category": "characters",
            "name": "Custom Heroine",
            "keywords": "1girl, superhero suit, cape",
            "negative": "low quality",
            "weight": 1.2,
        }
        create_resp = await self.client.request("POST", "/libretto/api/v1/presets", json=new_preset)
        self.assertEqual(create_resp.status, 201)
        created = await create_resp.json()
        pid = created["preset"]["id"]
        self.assertTrue(created["preset"]["is_custom"])
        self.assertEqual(created["preset"]["source"], "user")

        # 2. Verify it appears in preset list with source filter
        list_user = await self.client.request("GET", "/libretto/api/v1/presets?source=user")
        self.assertEqual(list_user.status, 200)
        user_items = (await list_user.json())["items"]
        self.assertTrue(any(p["id"] == pid for p in user_items))

        # 3. Export pack
        export_resp = await self.client.request("GET", "/libretto/api/v1/presets/export_pack")
        self.assertEqual(export_resp.status, 200)
        self.assertEqual(export_resp.headers.get("Content-Type"), "application/zip")
        zip_data = await export_resp.read()
        self.assertTrue(len(zip_data) > 50)

        # 4. Attempt to delete bundled preset -> 403
        del_bundled = await self.client.request("DELETE", "/libretto/api/v1/presets/characters/p-046f9ebb")
        self.assertEqual(del_bundled.status, 403)

        # 5. Delete custom preset -> 200
        del_user = await self.client.request("DELETE", f"/libretto/api/v1/presets/characters/{pid}")
        self.assertEqual(del_user.status, 200)

        # 6. Import pack back
        import_resp = await self.client.request("POST", "/libretto/api/v1/presets/import_pack", data=zip_data)
        self.assertEqual(import_resp.status, 200)
        import_res = await import_resp.json()
        self.assertTrue(import_res["imported_presets"] >= 1)

        # Clean up imported
        await self.client.request("DELETE", f"/libretto/api/v1/presets/characters/{pid}")


if __name__ == "__main__":
    unittest.main()




