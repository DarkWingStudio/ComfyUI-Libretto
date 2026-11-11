"""Utility nodes for ComfyUI-Libretto.

Provides independent collection seed management and prompt text previewing.
"""

from __future__ import annotations

import random
from typing import Any, Dict, Tuple


class LibrettoCollectionSeedNode:
    """Provides an isolated seed for collection selection without affecting image sampler seeds."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "seed": ("INT", {"default": 42, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
                "control": (["fixed", "randomize", "increment", "decrement"], {"default": "fixed"}),
            },
            "optional": {
                "step": ("INT", {"default": 0, "min": 0, "max": 1000000}),
            },
        }

    RETURN_TYPES = ("INT",)
    RETURN_NAMES = ("seed",)
    FUNCTION = "get_seed"
    CATEGORY = "Libretto/Utils"

    def get_seed(self, seed: int = 42, control: str = "fixed", step: int = 0) -> Tuple[int]:
        if control == "randomize":
            seed = random.randint(0, 0xFFFFFFFFFFFFFFFF)
        elif control == "increment":
            seed = (seed + 1 + step) & 0xFFFFFFFFFFFFFFFF
        elif control == "decrement":
            seed = (seed - 1 - step) & 0xFFFFFFFFFFFFFFFF
        return (seed,)


class LibrettoPromptPreviewNode:
    """Pass-through text preview node to inspect compiled prompt strings in the canvas."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "text": ("STRING", {"forceInput": True}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "preview"
    CATEGORY = "Libretto/Utils"

    def preview(self, text: str) -> Dict[str, Any]:
        return {"ui": {"string": [text]}, "result": (text,)}
