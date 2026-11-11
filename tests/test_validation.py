"""Unit tests for validation in ComfyUI-Libretto."""

import os
import sys
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.validation import (
    extract_workflow_requirements_and_interfaces,
    normalize_tags,
    sanitize_id,
    validate_entry_payload,
)


class TestValidation(unittest.TestCase):
    def test_sanitize_id(self):
        self.assertEqual(sanitize_id("valid-id_123"), "valid-id_123")
        self.assertIsNone(sanitize_id("../traversal"))
        self.assertIsNone(sanitize_id("id/with/slash"))
        self.assertIsNone(sanitize_id(""))

    def test_normalize_tags(self):
        tags = ["  Portrait ", "PORTRAIT", "lighting", "", "a" * 100]
        cleaned = normalize_tags(tags)
        self.assertIn("portrait", cleaned)
        self.assertIn("lighting", cleaned)
        self.assertEqual(len(cleaned), 3)  # deduplicated

    def test_validate_entry_payload_success(self):
        payload = {
            "title": "Valid Libretto",
            "summary": "Short description",
            "tags": ["test", "demo"],
            "workflow": {
                "format": "comfyui-json",
                "data": {
                    "nodes": [
                        {"id": 1, "type": "KSampler"},
                        {"id": 2, "type": "LibrettoInput", "widgets_values": ["prompt", "STRING"]},
                    ]
                },
            },
        }
        is_valid, errors, warnings, sanitized = validate_entry_payload(payload)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)
        self.assertEqual(sanitized["title"], "Valid Libretto")
        self.assertIn("KSampler", sanitized["requirements"]["node_classes"])
        self.assertEqual(len(sanitized["interfaces"]["inputs"]), 1)
        self.assertEqual(sanitized["interfaces"]["inputs"][0]["name"], "prompt")

    def test_validate_entry_payload_empty_title_fails(self):
        payload = {"title": "   ", "workflow": {"format": "comfyui-json", "data": {}}}
        is_valid, errors, warnings, sanitized = validate_entry_payload(payload)
        self.assertFalse(is_valid)
        self.assertTrue(any("Title is required" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
