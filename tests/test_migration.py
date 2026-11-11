"""Unit tests for legacy migration in ComfyUI-Libretto."""

import json
import os
import shutil
import sys
import tempfile
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.migration import MigrationManager
# pyrefly: ignore[missing-import]
from libretto.repository import LibraryRepository


class TestMigration(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="libretto_mig_test_")
        self.repo = LibraryRepository(self.temp_dir)
        self.manager = MigrationManager(self.repo)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_preview_and_run_migration(self):
        # Create a mock legacy ComfyUI workflow JSON
        legacy_dir = os.path.join(self.temp_dir, "legacy_files")
        os.makedirs(legacy_dir, exist_ok=True)
        wf_path = os.path.join(legacy_dir, "legacy_portrait.json")

        mock_wf = {
            "last_node_id": 2,
            "nodes": [
                {"id": 1, "type": "CheckpointLoaderSimple"},
                {"id": 2, "type": "KSampler"},
            ],
            "links": [],
        }
        with open(wf_path, "w", encoding="utf-8") as f:
            json.dump(mock_wf, f)

        # Preview
        preview = self.manager.preview_migration([wf_path])
        self.assertEqual(preview["convertible_count"], 1)
        self.assertEqual(preview["duplicate_count"], 0)
        self.assertEqual(preview["plan"][0]["format"], "comfyui_ui_workflow")

        # Run
        res = self.manager.run_migration([wf_path])
        self.assertEqual(res["status"], "completed")
        self.assertEqual(res["converted_count"], 1)

        # Verify entry in repository
        items, total, _ = self.repo.list_entries()
        self.assertEqual(total, 1)
        self.assertEqual(items[0]["title"], "Legacy Portrait")
        self.assertEqual(items[0]["requirements_count"], 2)

        # Idempotent retry: rerunning should detect duplicate
        preview_again = self.manager.preview_migration([wf_path])
        self.assertEqual(preview_again["duplicate_count"], 1)
        self.assertEqual(preview_again["convertible_count"], 0)


if __name__ == "__main__":
    unittest.main()
