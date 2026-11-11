"""LibrettoInput node definition."""

from __future__ import annotations

from typing import Any, Dict, Tuple


class AnyType(str):
    """Wildcard type helper that matches any ComfyUI connection type."""
    def __ne__(self, other: Any) -> bool:
        return False
    def __eq__(self, other: Any) -> bool:
        return True


any_type = AnyType("*")


class LibrettoInput:
    """
    Declares a named, user-facing parameter or connection that a reusable Libretto composition expects.
    Can either supply a typed literal widget value or pass through a connected socket value.
    """

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "name": ("STRING", {"default": "input_param", "multiline": False}),
                "value_type": (
                    [
                        "STRING",
                        "INT",
                        "FLOAT",
                        "BOOLEAN",
                        "IMAGE",
                        "LATENT",
                        "MODEL",
                        "CONDITIONING",
                        "CLIP",
                        "VAE",
                        "CUSTOM",
                    ],
                    {"default": "STRING"},
                ),
            },
            "optional": {
                "value_input": (any_type, {}),
                "string_value": ("STRING", {"default": "", "multiline": True}),
                "int_value": ("INT", {"default": 0, "min": -1000000, "max": 1000000}),
                "float_value": ("FLOAT", {"default": 0.0, "min": -1000000.0, "max": 1000000.0, "step": 0.01}),
                "boolean_value": ("BOOLEAN", {"default": False}),
                "description": ("STRING", {"default": "", "multiline": False}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("value",)
    FUNCTION = "process"
    CATEGORY = "Libretto"

    def process(
        self,
        name: str,
        value_type: str,
        value_input: Any = None,
        string_value: str = "",
        int_value: int = 0,
        float_value: float = 0.0,
        boolean_value: bool = False,
        description: str = "",
    ) -> Tuple[Any]:
        # If an external node is plugged in, pass that through directly
        if value_input is not None:
            return (value_input,)

        # Otherwise evaluate based on selected widget value_type
        if value_type == "INT":
            return (int(int_value),)
        elif value_type == "FLOAT":
            return (float(float_value),)
        elif value_type == "BOOLEAN":
            return (bool(boolean_value),)
        elif value_type == "STRING":
            return (str(string_value),)

        # For object types without direct link, return None or fallback string
        return (string_value or None,)
