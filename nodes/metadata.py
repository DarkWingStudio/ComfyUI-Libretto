"""LibrettoMetadata node definition."""

from __future__ import annotations

from typing import Any, Dict, Tuple


class AnyType(str):
    """Wildcard type helper that matches any ComfyUI connection type."""
    def __ne__(self, other: Any) -> bool:
        return False
    def __eq__(self, other: Any) -> bool:
        return True


any_type = AnyType("*")


class LibrettoMetadata:
    """
    Attaches display metadata (title, summary, tags, version) to a composition or graph segment.
    Optionally passes through a linked graph signal.
    """

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "title": ("STRING", {"default": "My Reusable Composition", "multiline": False}),
                "summary": ("STRING", {"default": "Description of this composition", "multiline": True}),
                "tags": ("STRING", {"default": "composition, utility", "multiline": False}),
                "version": ("STRING", {"default": "1.0.0", "multiline": False}),
            },
            "optional": {
                "passthrough": (any_type, {}),
            },
        }

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("passthrough",)
    FUNCTION = "execute"
    CATEGORY = "Libretto"

    def execute(
        self,
        title: str,
        summary: str,
        tags: str,
        version: str,
        passthrough: Any = None,
    ) -> Tuple[Any]:
        return (passthrough,)
