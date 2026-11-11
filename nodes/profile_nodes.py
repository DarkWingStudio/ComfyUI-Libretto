"""Model Profile nodes for ComfyUI-Libretto.

Outputs LIBRETTO_PROFILE objects tailored for SDXL, Pony, Flux, or custom models.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, Tuple

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.profiles.profile import BUILTIN_PROFILES, ModelProfile


class LibrettoSDXLProfileNode:
    """Standard SDXL tag-based formatting profile with quality tags."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["sdxl"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["sdxl"]
        profile = ModelProfile(
            id="sdxl",
            name="SDXL Standard",
            target_model="sdxl",
            format_style="tags",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoPonyProfileNode:
    """Pony Diffusion V6 profile with score-based quality tags."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["pony"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["pony"]
        profile = ModelProfile(
            id="pony",
            name="Pony Diffusion V6",
            target_model="pony",
            format_style="tags",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoFluxProfileNode:
    """Flux.1 profile utilizing natural language descriptive prose."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["flux"]
        return {
            "required": {},
            "optional": {
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        separator: str = ". ",
        positive_prefix: str = "",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["flux"]
        profile = ModelProfile(
            id="flux",
            name="Flux.1 (Dev / Schnell)",
            target_model="flux",
            format_style="natural_language",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix,
            negative_prefix="",
            weight_template="{text}",
            supports_negative=False,
        )
        return (profile,)


class LibrettoSD15ProfileNode:
    """Stable Diffusion 1.5 profile with classic masterpiece quality prefix and negative tags."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["sd15"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["sd15"]
        profile = ModelProfile(
            id="sd15",
            name="Stable Diffusion 1.5",
            target_model="sd15",
            format_style="tags",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoAnimagineProfileNode:
    """Animagine XL / NoobAI Danbooru anime profile with aesthetic rating tags."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["animagine"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["animagine"]
        profile = ModelProfile(
            id="animagine",
            name="Animagine XL / NoobAI",
            target_model="animagine",
            format_style="tags",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoIllustriousProfileNode:
    """Illustrious XL profile with anime aesthetic ratings."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["illustrious"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["illustrious"]
        profile = ModelProfile(
            id="illustrious",
            name="Illustrious XL",
            target_model="illustrious",
            format_style="tags",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoPhotorealProfileNode:
    """Photorealistic / Cinematic profile with 35mm film photography styling."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        base = BUILTIN_PROFILES["photoreal"]
        return {
            "required": {},
            "optional": {
                "positive_prefix": ("STRING", {"default": base.positive_prefix, "multiline": True}),
                "negative_prefix": ("STRING", {"default": base.negative_prefix, "multiline": True}),
                "separator": ("STRING", {"default": base.separator, "multiline": False}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        positive_prefix: str = "",
        negative_prefix: str = "",
        separator: str = ", ",
    ) -> Tuple[ModelProfile]:
        base = BUILTIN_PROFILES["photoreal"]
        profile = ModelProfile(
            id="photoreal",
            name="Photorealistic / Cinematic",
            target_model="photoreal",
            format_style="natural_language",
            separator=separator if separator else base.separator,
            positive_prefix=positive_prefix if positive_prefix else base.positive_prefix,
            positive_suffix=base.positive_suffix,
            negative_prefix=negative_prefix if negative_prefix else base.negative_prefix,
            weight_template=base.weight_template,
            supports_negative=True,
        )
        return (profile,)


class LibrettoCustomProfileNode:
    """Custom profile configuration allowing full control over formatting syntax."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "format_style": (["tags", "natural_language"], {"default": "tags"}),
                "separator": ("STRING", {"default": ", ", "multiline": False}),
            },
            "optional": {
                "positive_prefix": ("STRING", {"default": "", "multiline": True}),
                "positive_suffix": ("STRING", {"default": "", "multiline": True}),
                "negative_prefix": ("STRING", {"default": "", "multiline": True}),
                "negative_suffix": ("STRING", {"default": "", "multiline": True}),
                "weight_template": ("STRING", {"default": "({text}:{weight:.2f})", "multiline": False}),
                "supports_negative": ("BOOLEAN", {"default": True}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_PROFILE",)
    RETURN_NAMES = ("profile",)
    FUNCTION = "get_profile"
    CATEGORY = "Libretto/Profiles"

    def get_profile(
        self,
        format_style: str = "tags",
        separator: str = ", ",
        positive_prefix: str = "",
        positive_suffix: str = "",
        negative_prefix: str = "",
        negative_suffix: str = "",
        weight_template: str = "({text}:{weight:.2f})",
        supports_negative: bool = True,
    ) -> Tuple[ModelProfile]:
        profile = ModelProfile(
            id="custom",
            name="Custom Profile",
            target_model="custom",
            format_style=format_style,
            separator=separator,
            positive_prefix=positive_prefix,
            positive_suffix=positive_suffix,
            negative_prefix=negative_prefix,
            negative_suffix=negative_suffix,
            weight_template=weight_template,
            supports_negative=supports_negative,
        )
        return (profile,)

