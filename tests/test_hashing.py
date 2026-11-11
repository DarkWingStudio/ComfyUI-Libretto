"""Unit tests for hashing utilities in ComfyUI-Libretto."""

import os
import sys
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.hashing import calculate_entry_hash, canonical_json_dumps


class TestHashing(unittest.TestCase):
    def test_canonical_json_dumps_sorts_keys(self):
        obj1 = {"b": 2, "a": 1, "c": [3, 2, 1]}
        obj2 = {"a": 1, "c": [3, 2, 1], "b": 2}
        self.assertEqual(canonical_json_dumps(obj1), canonical_json_dumps(obj2))

    def test_calculate_entry_hash_ignores_mutable_fields(self):
        entry1 = {
            "id": "e_01",
            "title": "Title",
            "summary": "Summary",
            "created_at": "2026-11-11T00:00:00Z",
            "updated_at": "2026-11-11T00:00:00Z",
            "content_hash": "",
        }
        entry2 = {
            "id": "e_01",
            "title": "Title",
            "summary": "Summary",
            "created_at": "2026-11-11T05:00:00Z",
            "updated_at": "2026-11-11T12:00:00Z",
            "content_hash": "sha256:oldhash",
        }
        self.assertEqual(calculate_entry_hash(entry1), calculate_entry_hash(entry2))

    def test_calculate_entry_hash_detects_content_change(self):
        entry1 = {"id": "e_01", "title": "Title 1"}
        entry2 = {"id": "e_01", "title": "Title 2"}
        self.assertNotEqual(calculate_entry_hash(entry1), calculate_entry_hash(entry2))


if __name__ == "__main__":
    unittest.main()
