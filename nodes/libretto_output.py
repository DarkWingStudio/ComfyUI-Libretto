"""LibrettoOutput node definition."""

from __future__ import annotations

from typing import Any, Dict, Tuple


class AnyType(str):
    """Wildcard type helper that matches any ComfyUI connection type."""
    def __ne__(self, other: Any) -> bool:
        return False
    def __eq__(self, other: Any) -> bool:
        return True


any_type = AnyType("*")


class LibrettoOutput:
    """
    Marks a named output or result boundary in a reusable composition.
    Transparently passes through the linked value without mutation.
    """

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "name": ("STRING", {"default": "output_result", "multiline": False}),
                "value": (any_type, {}),
            },
            "optional": {
                "description": ("STRING", {"default": "", "multiline": False}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("value",)
    FUNCTION = "passthrough"
    CATEGORY = "Libretto"

    def passthrough(
        self,
        name: str,
        value: Any,
        description: str = "",
    ) -> Tuple[Any]:
        return (value,)
