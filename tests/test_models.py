"""Unit tests for models in ComfyUI-Libretto."""

import os
import sys
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.models import (
    CURRENT_SCHEMA_VERSION,
    LibraryEntry,
    LibraryManifest,
    ManifestEntryRef,
    EntrySource,
    CompatibilitySpec,
    RequirementsSpec,
    InterfacesSpec,
    InterfaceItem,
    WorkflowData,
    AssetSpec,
)


class TestModels(unittest.TestCase):
    def test_default_library_entry(self):
        entry = LibraryEntry(id="test_01", title="Test Composition")
        self.assertEqual(entry.id, "test_01")
        self.assertEqual(entry.title, "Test Composition")
        self.assertEqual(entry.schema_version, CURRENT_SCHEMA_VERSION)
        self.assertEqual(entry.version, "1.0.0")

        d = entry.to_dict()
        self.assertEqual(d["id"], "test_01")
        self.assertEqual(d["title"], "Test Composition")

        restored = LibraryEntry.from_dict(d)
        self.assertEqual(restored.id, entry.id)
        self.assertEqual(restored.title, entry.title)

    def test_interface_serialization(self):
        inf = InterfacesSpec(
            inputs=[
                InterfaceItem(name="prompt", value_type="STRING", default_value="a cat"),
                InterfaceItem(name="steps", value_type="INT", default_value=20),
            ],
            outputs=[InterfaceItem(name="image", value_type="IMAGE")],
        )
        d = inf.to_dict()
        self.assertEqual(len(d["inputs"]), 2)
        self.assertEqual(d["inputs"][0]["name"], "prompt")
        self.assertEqual(d["inputs"][1]["value_type"], "INT")

        restored = InterfacesSpec.from_dict(d)
        self.assertEqual(len(restored.inputs), 2)
        self.assertEqual(len(restored.outputs), 1)

    def test_manifest_serialization(self):
        manifest = LibraryManifest(
            library_id="test_lib",
            entries=[
                ManifestEntryRef(
                    id="e1",
                    title="Entry 1",
                    path="entries/e1.json",
                    content_hash="sha256:abc",
                    tags=["portrait"],
                )
            ],
        )
        d = manifest.to_dict()
        self.assertEqual(d["library_id"], "test_lib")
        self.assertEqual(len(d["entries"]), 1)

        restored = LibraryManifest.from_dict(d)
        self.assertEqual(restored.entries[0].title, "Entry 1")


if __name__ == "__main__":
    unittest.main()
