"""Regression test for loading Libretto alongside ComfyUI's top-level nodes module."""

import importlib.util
import os
import sys
import types
import unittest


class TestComfyUILoading(unittest.TestCase):
    def test_exports_libretto_nodes_despite_core_nodes_module(self):
        pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        core = types.ModuleType("nodes")
        core.NODE_CLASS_MAPPINGS = {"KSampler": object}
        core.NODE_DISPLAY_NAME_MAPPINGS = {}
        saved = sys.modules.get("nodes")
        sys.modules["nodes"] = core
        try:
            spec = importlib.util.spec_from_file_location(
                "ComfyUI-Libretto-under-test",
                os.path.join(pkg_dir, "__init__.py"),
                submodule_search_locations=[pkg_dir],
            )
            mod = importlib.util.module_from_spec(spec)
            sys.modules[spec.name] = mod
            spec.loader.exec_module(mod)
            names = set(mod.NODE_CLASS_MAPPINGS)
            self.assertIn("LibrettoPromptBuilder", names)
            self.assertNotIn("KSampler", names)
        finally:
            sys.modules.pop("ComfyUI-Libretto-under-test", None)
            if saved is not None:
                sys.modules["nodes"] = saved
            else:
                sys.modules.pop("nodes", None)


if __name__ == "__main__":
    unittest.main()
