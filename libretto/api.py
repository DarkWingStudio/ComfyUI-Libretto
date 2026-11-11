"""Aiohttp API endpoints for ComfyUI-Libretto."""

from __future__ import annotations

import base64
import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, Optional

try:
    # pyrefly: ignore[missing-import]
    from aiohttp import web
except ImportError:
    web = None

from .models import CURRENT_SCHEMA_VERSION
# pyrefly: ignore[missing-import]
from .repository import ConcurrencyConflictError, LibraryRepository, NotFoundError
# pyrefly: ignore[missing-import]
from .validation import (
    extract_workflow_requirements_and_interfaces,
    sanitize_id,
    validate_entry_payload,
)

logger = logging.getLogger("ComfyUI-Libretto")
API_VERSION = "1.0.0"


class LibrettoApiHandler:
    """Handles REST API requests for ComfyUI-Libretto."""

    def __init__(self, repository: LibraryRepository, preset_store: Optional[Any] = None):
        self.repository = repository
        if preset_store is None:
            pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            presets_dir = Path(os.path.join(pkg_dir, "library_presets"))
            try:
                # pyrefly: ignore[missing-import]
                from .library.preset_store import PresetStore
                self.preset_store = PresetStore(presets_dir)
            except Exception:
                self.preset_store = None
        else:
            self.preset_store = preset_store

    def json_response(self, data: Any, status: int = 200, headers: Optional[Dict[str, str]] = None) -> web.Response:
        return web.Response(
            body=json.dumps(data, ensure_ascii=False),
            status=status,
            content_type="application/json",
            charset="utf-8",
            headers=headers or {},
        )

    def error_response(self, code: str, message: str, status: int = 400, details: Any = None) -> web.Response:
        payload = {
            "error": {
                "code": code,
                "message": message,
                "details": details or [],
            }
        }
        return self.json_response(payload, status=status)

    async def handle_health(self, request: web.Request) -> web.Response:
        """GET /health"""
        stats = self.repository.get_storage_stats()
        return self.json_response({
            "status": "ok",
            "api_version": API_VERSION,
            "schema_version": CURRENT_SCHEMA_VERSION,
            "storage": stats,
        })

    async def handle_list_entries(self, request: web.Request) -> web.Response:
        """GET /entries?q=...&tag=...&sort=...&limit=...&cursor=..."""
        q = request.query.get("q", "")
        tag = request.query.get("tag", "")
        sort = request.query.get("sort", "updated_at")
        limit = int(request.query.get("limit", 50))
        cursor = int(request.query.get("cursor", 0))

        items, total, next_cursor = self.repository.list_entries(
            q=q, tag=tag, sort=sort, limit=limit, cursor=cursor
        )
        return self.json_response({
            "items": items,
            "total": total,
            "next_cursor": next_cursor,
        })

    async def handle_get_entry(self, request: web.Request) -> web.Response:
        """GET /entries/{id}"""
        entry_id = request.match_info.get("id", "")
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            return self.error_response("INVALID_ID", "Invalid entry ID", status=400)

        try:
            entry = self.repository.get_entry(safe_id)
            diagnostics = {
                "schema_version": entry.schema_version,
                "content_hash": entry.content_hash,
                "node_count": len(entry.requirements.node_classes),
                "has_preview": bool(entry.assets.preview),
            }
            return self.json_response({
                "entry": entry.to_dict(include_workflow=True),
                "diagnostics": diagnostics,
            })
        except NotFoundError:
            return self.error_response("NOT_FOUND", f"Entry '{entry_id}' not found", status=404)
        except Exception as e:
            logger.error("Error retrieving entry %s: %s", entry_id, e)
            return self.error_response("INTERNAL_ERROR", "Internal server error", status=500)

    async def handle_create_entry(self, request: web.Request) -> web.Response:
        """POST /entries"""
        try:
            payload = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON body", status=400)

        is_valid, errors, warnings, sanitized = validate_entry_payload(payload, is_update=False)
        if not is_valid:
            return self.error_response("VALIDATION_ERROR", "; ".join(errors), status=422, details=errors)

        try:
            entry = self.repository.create_entry(sanitized)
            return self.json_response({
                "entry": entry.to_dict(include_workflow=True),
                "warnings": warnings,
            }, status=201)
        except Exception as e:
            logger.error("Error creating entry: %s", e)
            return self.error_response("STORAGE_ERROR", str(e), status=500)

    async def handle_update_entry(self, request: web.Request) -> web.Response:
        """PUT /entries/{id}"""
        entry_id = request.match_info.get("id", "")
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            return self.error_response("INVALID_ID", "Invalid entry ID", status=400)

        expected_hash = request.headers.get("If-Match")

        try:
            payload = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON body", status=400)

        try:
            entry = self.repository.update_entry(safe_id, payload, expected_hash=expected_hash)
            return self.json_response({"entry": entry.to_dict(include_workflow=True)})
        except NotFoundError:
            return self.error_response("NOT_FOUND", f"Entry '{entry_id}' not found", status=404)
        except ConcurrencyConflictError as cfe:
            return self.error_response("CONFLICT", str(cfe), status=409)
        except ValueError as ve:
            return self.error_response("VALIDATION_ERROR", str(ve), status=422)
        except Exception as e:
            logger.error("Error updating entry %s: %s", entry_id, e)
            return self.error_response("INTERNAL_ERROR", str(e), status=500)

    async def handle_delete_entry(self, request: web.Request) -> web.Response:
        """DELETE /entries/{id}"""
        entry_id = request.match_info.get("id", "")
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            return self.error_response("INVALID_ID", "Invalid entry ID", status=400)

        expected_hash = request.headers.get("If-Match")

        try:
            self.repository.delete_entry(safe_id, expected_hash=expected_hash)
            return web.Response(status=204)
        except NotFoundError:
            return self.error_response("NOT_FOUND", f"Entry '{entry_id}' not found", status=404)
        except ConcurrencyConflictError as cfe:
            return self.error_response("CONFLICT", str(cfe), status=409)
        except Exception as e:
            logger.error("Error deleting entry %s: %s", entry_id, e)
            return self.error_response("INTERNAL_ERROR", str(e), status=500)

    async def handle_validate(self, request: web.Request) -> web.Response:
        """POST /validate"""
        try:
            payload = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON body", status=400)

        is_valid, errors, warnings, sanitized = validate_entry_payload(payload)
        return self.json_response({
            "valid": is_valid,
            "errors": errors,
            "warnings": warnings,
            "requirements": sanitized.get("requirements", {}),
            "interfaces": sanitized.get("interfaces", {}),
        })

    async def handle_scan_workflow(self, request: web.Request) -> web.Response:
        """POST /scan_workflow (extracts requirements and Libretto interfaces from a raw workflow)"""
        try:
            payload = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON body", status=400)

        wf_data = payload.get("data") if isinstance(payload, dict) and "data" in payload else payload
        if not isinstance(wf_data, dict):
            return self.error_response("INVALID_PAYLOAD", "Workflow must be a JSON object", status=400)

        node_classes, inputs, outputs = extract_workflow_requirements_and_interfaces(wf_data)
        return self.json_response({
            "node_classes": node_classes,
            "inputs": inputs,
            "outputs": outputs,
            "node_count": len(node_classes),
        })

    async def handle_export(self, request: web.Request) -> web.Response:
        """GET /export/{id}"""
        entry_id = request.match_info.get("id", "")
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            return self.error_response("INVALID_ID", "Invalid entry ID", status=400)

        try:
            entry = self.repository.get_entry(safe_id)
            export_pkg = {
                "package_format": "libretto-package",
                "package_version": "1.0.0",
                "exported_at": entry.updated_at,
                "entry": entry.to_dict(include_workflow=True),
            }
            body = json.dumps(export_pkg, indent=2, ensure_ascii=False)
            safe_title = "".join(c for c in entry.title if c.isalnum() or c in ("-", "_")).strip() or "libretto"
            filename = f"{safe_title}_{safe_id}.libretto.json"

            return web.Response(
                body=body,
                content_type="application/json",
                charset="utf-8",
                headers={
                    "Content-Disposition": f'attachment; filename="{filename}"'
                },
            )
        except NotFoundError:
            return self.error_response("NOT_FOUND", "Entry not found", status=404)
        except Exception as e:
            return self.error_response("INTERNAL_ERROR", str(e), status=500)

    async def handle_import(self, request: web.Request) -> web.Response:
        """POST /import (accepts either a Libretto package or raw entry, supports dry_run)"""
        try:
            data = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON body", status=400)

        dry_run = request.query.get("dry_run", "false").lower() in ("true", "1")
        conflict_policy = request.query.get("conflict", "rename")  # rename, overwrite, skip

        # Determine if package wrapper or single entry or workflow
        entry_payload = data.get("entry") if isinstance(data, dict) and "package_format" in data else data

        # If imported file is pure ComfyUI workflow JSON (has nodes array or prompt dict)
        if isinstance(entry_payload, dict) and "workflow" not in entry_payload:
            if "nodes" in entry_payload or any(isinstance(v, dict) and "class_type" in v for v in entry_payload.values()):
                entry_payload = {
                    "title": "Imported Workflow",
                    "summary": "Imported from external workflow file.",
                    "tags": ["imported"],
                    "workflow": {
                        "format": "comfyui-json",
                        "data": entry_payload,
                    },
                }

        is_valid, errors, warnings, sanitized = validate_entry_payload(entry_payload)
        if not is_valid:
            return self.error_response("VALIDATION_ERROR", "; ".join(errors), status=422, details=errors)

        if dry_run:
            return self.json_response({
                "dry_run": True,
                "valid": True,
                "entry_preview": {
                    "id": sanitized["id"],
                    "title": sanitized["title"],
                    "requirements": sanitized.get("requirements", {}),
                    "interfaces": sanitized.get("interfaces", {}),
                },
                "warnings": warnings,
            })

        backup_id = self.repository.create_backup(tag="pre_import")

        try:
            # Handle conflict if ID exists
            target_id = sanitized["id"]
            try:
                self.repository.get_entry(target_id)
                exists = True
            except NotFoundError:
                exists = False

            if exists:
                if conflict_policy == "skip":
                    return self.json_response({"status": "skipped", "message": "Entry already exists"})
                elif conflict_policy == "rename":
                    # pyrefly: ignore[missing-import]
                    from .validation import generate_entry_id
                    sanitized["id"] = generate_entry_id()
                    sanitized["title"] = f"{sanitized['title']} (Copy)"
                    entry = self.repository.create_entry(sanitized)
                else:  # overwrite
                    entry = self.repository.update_entry(target_id, sanitized)
            else:
                entry = self.repository.create_entry(sanitized)

            return self.json_response({
                "status": "imported",
                "entry": entry.to_dict(include_workflow=True),
                "backup_id": backup_id,
            }, status=201)

        except Exception as e:
            logger.error("Import error: %s", e)
            return self.error_response("IMPORT_ERROR", str(e), status=500)

    async def handle_upload_preview(self, request: web.Request) -> web.Response:
        """POST /entries/{id}/preview"""
        entry_id = request.match_info.get("id", "")
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            return self.error_response("INVALID_ID", "Invalid entry ID", status=400)

        try:
            data = await request.json()
            raw_b64 = str(data.get("image_base64", ""))
            if not raw_b64:
                return self.error_response("INVALID_PAYLOAD", "image_base64 field required", status=400)
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",", 1)[1]

            import base64
            img_bytes = base64.b64decode(raw_b64)
            rel_path = self.repository.save_preview(safe_id, "preview.png", img_bytes)
            return self.json_response({"preview": rel_path})
        except Exception as e:
            return self.error_response("UPLOAD_ERROR", str(e), status=500)

    async def handle_export_all(self, request: web.Request) -> web.Response:
        """GET /export_all (Download library as a ZIP bundle)"""
        import io
        import zipfile
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            if os.path.exists(self.repository.manifest_path):
                zf.write(self.repository.manifest_path, "manifest.json")
            if os.path.exists(self.repository.entries_dir):
                for f in os.listdir(self.repository.entries_dir):
                    if f.endswith(".json"):
                        zf.write(os.path.join(self.repository.entries_dir, f), f"entries/{f}")
            if os.path.exists(self.repository.assets_dir):
                for f in os.listdir(self.repository.assets_dir):
                    zf.write(os.path.join(self.repository.assets_dir, f), f"assets/{f}")

        zip_buffer.seek(0)
        return web.Response(
            body=zip_buffer.read(),
            content_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="libretto_library_backup.zip"'},
        )

    async def handle_migration_preview(self, request: web.Request) -> web.Response:
        """POST /migration/preview"""
        # pyrefly: ignore[missing-import]
        from .migration import MigrationManager
        manager = MigrationManager(self.repository)
        preview = manager.preview_migration()
        return self.json_response(preview)

    async def handle_migration_run(self, request: web.Request) -> web.Response:
        """POST /migration/run"""
        # pyrefly: ignore[missing-import]
        from .migration import MigrationManager
        manager = MigrationManager(self.repository)
        result = manager.run_migration()
        return self.json_response(result)

    async def handle_list_profiles(self, request: web.Request) -> web.Response:
        """GET /profiles"""
        # pyrefly: ignore[missing-import]
        from .profiles import BUILTIN_PROFILES
        profiles = [p.to_dict() for p in BUILTIN_PROFILES.values()]
        return self.json_response({"profiles": profiles})

    async def handle_list_categories(self, request: web.Request) -> web.Response:
        """GET /categories"""
        if self.preset_store:
            cats = self.preset_store.get_categories()
            return self.json_response({"categories": cats})

        # pyrefly: ignore[missing-import]
        from .profiles import DEFAULT_CATEGORY_ORDER
        categories = [
            {"id": cat, "names": {"en-US": cat.capitalize()}, "name": cat.capitalize()}
            for cat in DEFAULT_CATEGORY_ORDER
        ]
        return self.json_response({"categories": categories})

    async def handle_list_library_presets(self, request: web.Request) -> web.Response:
        """GET /presets?category=...&q=...&limit=...&offset=...&source=..."""
        if not self.preset_store:
            return self.json_response({"total": 0, "items": []})

        category = request.query.get("category")
        q = request.query.get("q", "")
        limit = int(request.query.get("limit", 100))
        offset = int(request.query.get("offset", 0))
        source = request.query.get("source", "all")

        counts = self.preset_store.get_counts(category=category, query=q)
        data = self.preset_store.list_presets(
            category=category, query=q, limit=limit, offset=offset, source=source
        )
        data["total_all"] = counts["all"]
        data["total_bundled"] = counts["bundled"]
        data["total_custom"] = counts["user"]
        return self.json_response(data)

    async def handle_save_library_preset(self, request: web.Request) -> web.Response:
        """POST /presets - create or update a custom preset"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        try:
            body = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON payload", status=400)

        category = str(body.get("category", "characters")).strip()
        name = str(body.get("name", "")).strip()
        keywords = str(body.get("keywords", "")).strip()
        negative = str(body.get("negative", "")).strip()
        weight = float(body.get("weight", 1.0))
        preset_id = body.get("id")
        description = str(body.get("description", "")).strip()
        labels = body.get("labels", [])

        if not name:
            return self.error_response("VALIDATION_ERROR", "Preset name is required", status=400)

        thumb_bytes = None
        thumb_b64 = body.get("thumbnail_base64")
        if thumb_b64 and isinstance(thumb_b64, str):
            try:
                if "," in thumb_b64:
                    thumb_b64 = thumb_b64.split(",", 1)[1]
                thumb_bytes = base64.b64decode(thumb_b64)
            except Exception:
                pass

        try:
            saved = self.preset_store.save_preset(
                category=category,
                name=name,
                keywords=keywords,
                negative=negative,
                weight=weight,
                preset_id=preset_id,
                description=description,
                labels=labels,
                thumbnail_bytes=thumb_bytes,
            )
            return self.json_response({"preset": saved}, status=201)
        except Exception as e:
            logger.error("Error saving preset: %s", e)
            return self.error_response("SAVE_ERROR", str(e), status=500)

    async def handle_delete_library_preset(self, request: web.Request) -> web.Response:
        """DELETE /presets/{category}/{id}"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        cat = request.match_info.get("category", "")
        pid = request.match_info.get("id", "")

        try:
            deleted = self.preset_store.delete_preset(cat, pid)
            if not deleted:
                return self.error_response("NOT_FOUND", "Preset not found", status=404)
            return self.json_response({"success": True, "id": pid})
        except PermissionError as pe:
            return self.error_response("FORBIDDEN", str(pe), status=403)
        except Exception as e:
            return self.error_response("DELETE_ERROR", str(e), status=500)

    async def handle_export_presets_pack(self, request: web.Request) -> web.Response:
        """GET /presets/export_pack?category=...&include_bundled=..."""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        cat = request.query.get("category")
        inc_bundled = request.query.get("include_bundled", "false").lower() in ("1", "true", "yes")

        try:
            pack_bytes = self.preset_store.export_pack(category=cat, include_bundled=inc_bundled)
            return web.Response(
                body=pack_bytes,
                content_type="application/zip",
                headers={"Content-Disposition": 'attachment; filename="libretto_presets.zip"'},
            )
        except Exception as e:
            return self.error_response("EXPORT_ERROR", str(e), status=500)

    async def handle_import_presets_pack(self, request: web.Request) -> web.Response:
        """POST /presets/import_pack - upload zip pack"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        pack_bytes = None
        if request.content_type == "application/json":
            try:
                body = await request.json()
                b64 = body.get("pack_base64", "")
                if "," in b64:
                    b64 = b64.split(",", 1)[1]
                pack_bytes = base64.b64decode(b64)
            except Exception:
                return self.error_response("INVALID_JSON", "Malformed pack payload", status=400)
        else:
            pack_bytes = await request.read()

        if not pack_bytes:
            return self.error_response("BAD_REQUEST", "Empty file payload", status=400)

        try:
            res = self.preset_store.import_pack(pack_bytes)
            return self.json_response(res)
        except Exception as e:
            return self.error_response("IMPORT_ERROR", str(e), status=500)

    async def handle_get_library_preset(self, request: web.Request) -> web.Response:
        """GET /presets/{category}/{id}"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        cat = request.match_info.get("category", "")
        pid = request.match_info.get("id", "")
        preset = self.preset_store.get_preset(cat, pid)
        if not preset:
            return self.error_response("NOT_FOUND", "Preset not found", status=404)
        return self.json_response({"preset": preset})

    async def handle_serve_library_thumb(self, request: web.Request) -> web.Response:
        """GET /presets/thumb/{category}/{id}"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        cat = request.match_info.get("category", "")
        pid = request.match_info.get("id", "")
        thumb_path = self.preset_store.get_thumbnail_path(cat, pid)
        if not thumb_path or not thumb_path.exists():
            return self.error_response("NOT_FOUND", "Thumbnail not found", status=404)

        ext = thumb_path.suffix.lower()
        mime = "image/webp"
        if ext == ".png":
            mime = "image/png"
        elif ext in (".jpg", ".jpeg"):
            mime = "image/jpeg"

        with open(thumb_path, "rb") as f:
            return web.Response(
                body=f.read(),
                content_type=mime,
                headers={"Cache-Control": "public, max-age=86400"},
            )

    async def handle_serve_library_thumb_direct(self, request: web.Request) -> web.Response:
        """GET /presets/thumb/{id}"""
        if not self.preset_store:
            return self.error_response("NOT_FOUND", "Preset store not configured", status=404)

        pid = request.match_info.get("id", "")
        thumb_path = self.preset_store.get_thumbnail_path("", pid)
        if not thumb_path or not thumb_path.exists():
            return self.error_response("NOT_FOUND", "Thumbnail not found", status=404)

        ext = thumb_path.suffix.lower()
        mime = "image/webp"
        if ext == ".png":
            mime = "image/png"
        elif ext in (".jpg", ".jpeg"):
            mime = "image/jpeg"

        with open(thumb_path, "rb") as f:
            return web.Response(
                body=f.read(),
                content_type=mime,
                headers={"Cache-Control": "public, max-age=86400"},
            )

    async def handle_list_tags(self, request: web.Request) -> web.Response:
        """GET /tags"""
        if not self.preset_store:
            return self.json_response({"tags": {}})
        return self.json_response({"tags": self.preset_store._tags})

    async def handle_compile_preview(self, request: web.Request) -> web.Response:
        """POST /compile_preview"""
        try:
            body = await request.json()
        except Exception:
            return self.error_response("INVALID_JSON", "Malformed JSON payload", status=400)

        profile_id = str(body.get("profile_id", "sdxl"))
        components_data = body.get("components", [])
        extra_pos = str(body.get("extra_positive", ""))
        extra_neg = str(body.get("extra_negative", ""))
        seed = body.get("seed")

        # pyrefly: ignore[missing-import]
        from .compiler import PromptCompiler, PromptComponent
        # pyrefly: ignore[missing-import]
        from .profiles import BUILTIN_PROFILES

        profile = BUILTIN_PROFILES.get(profile_id, BUILTIN_PROFILES["sdxl"])
        components = [
            PromptComponent.from_dict(c)
            for c in components_data
            if isinstance(c, dict)
        ]
        compiler = PromptCompiler(profile)
        compiled = compiler.compile(
            components=components,
            extra_positive=extra_pos,
            extra_negative=extra_neg,
            seed=seed,
        )
        return self.json_response(compiled.to_dict())

    async def handle_serve_asset(self, request: web.Request) -> web.Response:
        """GET /assets/{filename}"""
        filename = request.match_info.get("filename", "")
        # Prevent traversal
        clean_filename = os.path.basename(filename)
        asset_path = os.path.join(self.repository.assets_dir, clean_filename)

        if not os.path.exists(asset_path):
            return self.error_response("NOT_FOUND", "Asset not found", status=404)

        ext = os.path.splitext(clean_filename)[1].lower()
        mime_types = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
        }
        content_type = mime_types.get(ext, "application/octet-stream")

        with open(asset_path, "rb") as f:
            return web.Response(body=f.read(), content_type=content_type)


def register_api_routes(app_or_router: Any, repository: LibraryRepository) -> LibrettoApiHandler:
    """
    Register Libretto API routes with an aiohttp router or PromptServer instance.
    """
    handler = LibrettoApiHandler(repository)
    base = "/libretto/api/v1"

    # Support aiohttp web.Application or ComfyUI PromptServer
    router = app_or_router.router if hasattr(app_or_router, "router") else app_or_router

    router.add_get(f"{base}/health", handler.handle_health)
    router.add_get(f"{base}/entries", handler.handle_list_entries)
    router.add_get(f"{base}/entries/{{id}}", handler.handle_get_entry)
    router.add_post(f"{base}/entries", handler.handle_create_entry)
    router.add_put(f"{base}/entries/{{id}}", handler.handle_update_entry)
    router.add_delete(f"{base}/entries/{{id}}", handler.handle_delete_entry)
    router.add_post(f"{base}/validate", handler.handle_validate)
    router.add_post(f"{base}/scan_workflow", handler.handle_scan_workflow)
    router.add_get(f"{base}/export/{{id}}", handler.handle_export)
    router.add_get(f"{base}/export_all", handler.handle_export_all)
    router.add_post(f"{base}/import", handler.handle_import)
    router.add_post(f"{base}/entries/{{id}}/preview", handler.handle_upload_preview)
    router.add_post(f"{base}/migration/preview", handler.handle_migration_preview)
    router.add_post(f"{base}/migration/run", handler.handle_migration_run)
    router.add_get(f"{base}/profiles", handler.handle_list_profiles)
    router.add_get(f"{base}/categories", handler.handle_list_categories)
    router.add_get(f"{base}/presets", handler.handle_list_library_presets)
    router.add_post(f"{base}/presets", handler.handle_save_library_preset)
    router.add_get(f"{base}/presets/export_pack", handler.handle_export_presets_pack)
    router.add_post(f"{base}/presets/import_pack", handler.handle_import_presets_pack)
    router.add_get(f"{base}/presets/{{category}}/{{id}}", handler.handle_get_library_preset)
    router.add_delete(f"{base}/presets/{{category}}/{{id}}", handler.handle_delete_library_preset)
    router.add_get(f"{base}/presets/thumb/{{id}}", handler.handle_serve_library_thumb_direct)
    router.add_get(f"{base}/presets/thumb/{{category}}/{{id}}", handler.handle_serve_library_thumb)
    router.add_get(f"{base}/tags", handler.handle_list_tags)
    router.add_post(f"{base}/compile_preview", handler.handle_compile_preview)
    router.add_get(f"{base}/assets/{{filename}}", handler.handle_serve_asset)

    logger.info("ComfyUI-Libretto API routes registered at %s", base)
    return handler
