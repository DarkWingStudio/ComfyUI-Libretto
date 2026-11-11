"""Asset nodes for ComfyUI-Libretto.

Generates structured LIBRETTO_ASSET components representing characters, outfits,
poses, lighting, environments, styles, and custom prompt blocks.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, Tuple

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.compiler.components import PromptComponent
# pyrefly: ignore[missing-import]
from libretto.profiles.profile import HAIR_COLORS


class LibrettoCharacterNode:
    """Defines a character head asset with core traits, identity, and optional LoRA."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "name": ("STRING", {"default": "Character 1", "multiline": False}),
                "keywords": ("STRING", {"default": "1girl, solo, silver hair, blue eyes", "multiline": True}),
            },
            "optional": {
                "description": ("STRING", {"default": "", "multiline": True}),
                "negative": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
                "lora_name": ("STRING", {"default": "", "multiline": False}),
                "lora_strength": ("FLOAT", {"default": 1.0, "min": -2.0, "max": 2.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        name: str,
        keywords: str,
        description: str = "",
        negative: str = "",
        weight: float = 1.0,
        lora_name: str = "",
        lora_strength: float = 1.0,
    ) -> Tuple[PromptComponent]:
        lora = None
        if lora_name.strip():
            lora = {"name": lora_name.strip(), "strength": lora_strength}

        char_id = name.lower().replace(" ", "_").strip()
        comp = PromptComponent(
            id=char_id,
            name=name,
            category="character",
            keywords=keywords,
            description=description,
            negative=negative,
            weight=weight,
            character_id=char_id,
            lora=lora,
        )
        return (comp,)


class LibrettoOutfitNode:
    """Defines costume or clothing attributes, optionally bound to a character."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "white shirt, black pleated skirt", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Outfit", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "negative": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
                "character_id": ("STRING", {"default": "", "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Outfit",
        description: str = "",
        negative: str = "",
        weight: float = 1.0,
        character_id: str = "",
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="costume",
            keywords=keywords,
            description=description,
            negative=negative,
            weight=weight,
            character_id=character_id.strip() if character_id.strip() else None,
        )
        return (comp,)


class LibrettoHairNode:
    """Defines hairstyle and hair color attributes."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "long hair, twin braids, bangs", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Hair", "multiline": False}),
                "hair_color": (["none", "random"] + HAIR_COLORS, {"default": "none"}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
                "character_id": ("STRING", {"default": "", "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Hair",
        hair_color: str = "none",
        description: str = "",
        weight: float = 1.0,
        character_id: str = "",
    ) -> Tuple[PromptComponent]:
        selected_color = None
        if hair_color == "random":
            import random
            selected_color = random.choice(HAIR_COLORS)
        elif hair_color and hair_color != "none":
            selected_color = hair_color

        comp = PromptComponent(
            name=name,
            category="hair",
            keywords=keywords,
            description=description,
            weight=weight,
            character_id=character_id.strip() if character_id.strip() else None,
            hair_color=selected_color,
        )
        return (comp,)


class LibrettoPoseNode:
    """Defines character pose or action."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "standing, looking at viewer, hand on hip", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Pose", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Pose",
        description: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="pose",
            keywords=keywords,
            description=description,
            weight=weight,
        )
        return (comp,)


class LibrettoExpressionNode:
    """Defines facial expression and emotional mood."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "slight smile, blushing, warm eyes", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Expression", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Expression",
        description: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="expression",
            keywords=keywords,
            description=description,
            weight=weight,
        )
        return (comp,)


class LibrettoEnvironmentNode:
    """Defines the environment, background, or scene location."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "tokyo street at night, neon lights, reflections in puddle", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Environment", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "negative": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Environment",
        description: str = "",
        negative: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="environment",
            keywords=keywords,
            description=description,
            negative=negative,
            weight=weight,
        )
        return (comp,)


class LibrettoLightingNode:
    """Defines scene lighting and volumetric atmosphere."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "cinematic lighting, rim light, volumetric fog", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Lighting", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Lighting",
        description: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="lighting",
            keywords=keywords,
            description=description,
            weight=weight,
        )
        return (comp,)


class LibrettoCameraNode:
    """Defines camera framing, shot distance, and angle."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "cowboy shot, slightly low angle", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Camera", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Camera",
        description: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category="camera",
            keywords=keywords,
            description=description,
            weight=weight,
        )
        return (comp,)


class LibrettoStyleNode:
    """Defines art style, medium, and aesthetic rendering keywords."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "anime style, vibrant colors, detailed digital illustration", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Art Style", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
                "lora_name": ("STRING", {"default": "", "multiline": False}),
                "lora_strength": ("FLOAT", {"default": 1.0, "min": -2.0, "max": 2.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Art Style",
        description: str = "",
        weight: float = 1.0,
        lora_name: str = "",
        lora_strength: float = 1.0,
    ) -> Tuple[PromptComponent]:
        lora = None
        if lora_name.strip():
            lora = {"name": lora_name.strip(), "strength": lora_strength}
        comp = PromptComponent(
            name=name,
            category="style",
            keywords=keywords,
            description=description,
            weight=weight,
            lora=lora,
        )
        return (comp,)


class LibrettoCustomPromptNode:
    """General custom prompt component for any arbitrary tags or descriptions."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "keywords": ("STRING", {"default": "", "multiline": True}),
            },
            "optional": {
                "name": ("STRING", {"default": "Custom Prompt", "multiline": False}),
                "category": ("STRING", {"default": "custom", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True}),
                "negative": ("STRING", {"default": "", "multiline": True}),
                "weight": ("FLOAT", {"default": 1.0, "min": 0.1, "max": 3.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "create_asset"
    CATEGORY = "Libretto/Assets"

    def create_asset(
        self,
        keywords: str,
        name: str = "Custom Prompt",
        category: str = "custom",
        description: str = "",
        negative: str = "",
        weight: float = 1.0,
    ) -> Tuple[PromptComponent]:
        comp = PromptComponent(
            name=name,
            category=category.strip() if category.strip() else "custom",
            keywords=keywords,
            description=description,
            negative=negative,
            weight=weight,
        )
        return (comp,)

