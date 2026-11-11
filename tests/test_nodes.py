"""Unit tests for Libretto Custom Nodes."""

import os
import sys
import unittest

pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)

# pyrefly: ignore[missing-import]
from nodes.libretto_input import LibrettoInput
# pyrefly: ignore[missing-import]
from nodes.libretto_output import LibrettoOutput
# pyrefly: ignore[missing-import]
from nodes.metadata import LibrettoMetadata


class TestNodes(unittest.TestCase):
    def test_libretto_input_process_literal(self):
        node = LibrettoInput()

        # String literal
        out_str = node.process(name="prompt", value_type="STRING", string_value="photograph of forest")
        self.assertEqual(out_str, ("photograph of forest",))

        # Int literal
        out_int = node.process(name="steps", value_type="INT", int_value=30)
        self.assertEqual(out_int, (30,))

        # Float literal
        out_flt = node.process(name="cfg", value_type="FLOAT", float_value=7.5)
        self.assertEqual(out_flt, (7.5,))

        # Boolean literal
        out_bool = node.process(name="flag", value_type="BOOLEAN", boolean_value=True)
        self.assertEqual(out_bool, (True,))

    def test_libretto_input_process_connected(self):
        node = LibrettoInput()
        mock_model = {"model_name": "SDXL"}
        out = node.process(name="model_in", value_type="MODEL", value_input=mock_model)
        self.assertEqual(out, (mock_model,))

    def test_libretto_output_passthrough(self):
        node = LibrettoOutput()
        mock_latent = {"samples": [1, 2, 3]}
        out = node.passthrough(name="final_latent", value=mock_latent)
        self.assertEqual(out, (mock_latent,))

    def test_libretto_metadata_execute(self):
        node = LibrettoMetadata()
        out = node.execute(
            title="Pipeline",
            summary="Desc",
            tags="test",
            version="1.0.0",
            passthrough="signal",
        )
        self.assertEqual(out, ("signal",))


if __name__ == "__main__":
    unittest.main()
