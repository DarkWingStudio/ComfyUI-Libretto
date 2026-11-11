"""Unit tests for repository storage in ComfyUI-Libretto."""

import os
import shutil
import sys
import tempfile
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.repository import (
    ConcurrencyConflictError,
    LibraryRepository,
    NotFoundError,
)


class TestRepository(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="libretto_test_")
        self.repo = LibraryRepository(self.temp_dir)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_create_and_get_entry(self):
        payload = {
            "title": "Composition Alpha",
            "summary": "First test composition",
            "tags": ["alpha", "test"],
            "workflow": {
                "format": "comfyui-json",
                "data": {"nodes": [{"id": 1, "type": "KSampler"}]},
            },
        }
        entry = self.repo.create_entry(payload)
        self.assertTrue(entry.id)
        self.assertEqual(entry.title, "Composition Alpha")
        self.assertTrue(entry.content_hash.startswith("sha256:"))

        # Retrieve
        fetched = self.repo.get_entry(entry.id)
        self.assertEqual(fetched.title, entry.title)
        self.assertEqual(fetched.content_hash, entry.content_hash)

        # Verify Manifest
        manifest = self.repo.get_manifest()
        self.assertEqual(len(manifest.entries), 1)
        self.assertEqual(manifest.entries[0].id, entry.id)

    def test_list_and_search_entries(self):
        self.repo.create_entry({"title": "Portrait Lighting", "tags": ["portrait"]})
        self.repo.create_entry({"title": "Landscape HDR", "tags": ["nature"]})
        self.repo.create_entry({"title": "Anime Upscaler", "tags": ["anime", "upscale"]})

        items, total, _ = self.repo.list_entries()
        self.assertEqual(total, 3)

        # Search by query
        items, total, _ = self.repo.list_entries(q="Landscape")
        self.assertEqual(total, 1)
        self.assertEqual(items[0]["title"], "Landscape HDR")

        # Filter by tag
        items, total, _ = self.repo.list_entries(tag="anime")
        self.assertEqual(total, 1)
        self.assertEqual(items[0]["title"], "Anime Upscaler")

    def test_update_with_optimistic_locking(self):
        entry = self.repo.create_entry({"title": "Original Title"})
        orig_hash = entry.content_hash

        # Successful update
        updated = self.repo.update_entry(
            entry.id, {"title": "New Title"}, expected_hash=orig_hash
        )
        self.assertEqual(updated.title, "New Title")

        # Failed update with stale hash
        with self.assertRaises(ConcurrencyConflictError):
            self.repo.update_entry(
                entry.id, {"title": "Conflicted"}, expected_hash=orig_hash
            )

    def test_delete_entry(self):
        entry = self.repo.create_entry({"title": "To Delete"})
        self.repo.delete_entry(entry.id)

        with self.assertRaises(NotFoundError):
            self.repo.get_entry(entry.id)

        manifest = self.repo.get_manifest()
        self.assertEqual(len(manifest.entries), 0)

    def test_manifest_rebuild(self):
        self.repo.create_entry({"title": "Entry 1"})
        self.repo.create_entry({"title": "Entry 2"})

        # Delete manifest file manually
        os.remove(self.repo.manifest_path)
        self.assertFalse(os.path.exists(self.repo.manifest_path))

        # Rebuild manifest
        manifest = self.repo.rebuild_manifest()
        self.assertEqual(len(manifest.entries), 2)
        self.assertTrue(os.path.exists(self.repo.manifest_path))

    def test_backup_and_restore(self):
        e1 = self.repo.create_entry({"title": "Backup Test 1"})
        backup_id = self.repo.create_backup(tag="test")

        # Mutate
        self.repo.delete_entry(e1.id)
        self.assertEqual(len(self.repo.get_manifest().entries), 0)

        # Restore
        self.repo.restore_backup(backup_id)
        restored_entry = self.repo.get_entry(e1.id)
        self.assertEqual(restored_entry.title, "Backup Test 1")


if __name__ == "__main__":
    unittest.main()
