"""Prompt composition nodes for ComfyUI-Libretto.

Translates and compiles LIBRETTO_ASSET components and Model Profiles into standard
ComfyUI STRING sockets suitable for CLIPTextEncode and generation pipelines.
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict, List, Optional, Tuple

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.compiler import CompiledPrompt, PromptCompiler, PromptComponent
# pyrefly: ignore[missing-import]
from libretto.profiles import BUILTIN_PROFILES, ModelProfile


class LibrettoPromptBuilderNode:
    """Compiles structured creative assets using a Model Profile into ComfyUI STRINGs."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "profile": ("LIBRETTO_PROFILE",),
            },
            "optional": {
                "asset_1": ("LIBRETTO_ASSET",),
                "asset_2": ("LIBRETTO_ASSET",),
                "asset_3": ("LIBRETTO_ASSET",),
                "asset_4": ("LIBRETTO_ASSET",),
                "asset_5": ("LIBRETTO_ASSET",),
                "asset_6": ("LIBRETTO_ASSET",),
                "asset_bundle": ("LIBRETTO_ASSETS",),
                "extra_positive": ("STRING", {"default": "", "multiline": True}),
                "extra_negative": ("STRING", {"default": "", "multiline": True}),
                "collection_seed": ("INT", {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING")
    RETURN_NAMES = ("positive", "negative", "snapshot")
    FUNCTION = "build_prompt"
    CATEGORY = "Libretto/Prompts"

    def build_prompt(
        self,
        profile: ModelProfile,
        asset_1: Optional[PromptComponent] = None,
        asset_2: Optional[PromptComponent] = None,
        asset_3: Optional[PromptComponent] = None,
        asset_4: Optional[PromptComponent] = None,
        asset_5: Optional[PromptComponent] = None,
        asset_6: Optional[PromptComponent] = None,
        asset_bundle: Optional[List[PromptComponent]] = None,
        extra_positive: str = "",
        extra_negative: str = "",
        collection_seed: int = 0,
    ) -> Tuple[str, str, str]:
        components: List[PromptComponent] = []

        # Collect direct asset inputs
        for a in [asset_1, asset_2, asset_3, asset_4, asset_5, asset_6]:
            if a is not None and isinstance(a, PromptComponent):
                components.append(a)

        # Collect bundle items
        if asset_bundle and isinstance(asset_bundle, list):
            for item in asset_bundle:
                if isinstance(item, PromptComponent):
                    components.append(item)

        compiler = PromptCompiler(profile)
        compiled: CompiledPrompt = compiler.compile(
            components=components,
            extra_positive=extra_positive,
            extra_negative=extra_negative,
            seed=collection_seed,
        )

        snapshot_str = json.dumps(compiled.generation_snapshot, indent=2)
        return (compiled.positive, compiled.negative, snapshot_str)


class LibrettoPromptMergeNode:
    """Combines multiple LIBRETTO_ASSETs into a single LIBRETTO_ASSETS bundle."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {},
            "optional": {
                "asset_1": ("LIBRETTO_ASSET",),
                "asset_2": ("LIBRETTO_ASSET",),
                "asset_3": ("LIBRETTO_ASSET",),
                "asset_4": ("LIBRETTO_ASSET",),
                "asset_5": ("LIBRETTO_ASSET",),
                "asset_6": ("LIBRETTO_ASSET",),
                "bundle_input": ("LIBRETTO_ASSETS",),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSETS",)
    RETURN_NAMES = ("bundle",)
    FUNCTION = "merge_assets"
    CATEGORY = "Libretto/Prompts"

    def merge_assets(
        self,
        asset_1: Optional[PromptComponent] = None,
        asset_2: Optional[PromptComponent] = None,
        asset_3: Optional[PromptComponent] = None,
        asset_4: Optional[PromptComponent] = None,
        asset_5: Optional[PromptComponent] = None,
        asset_6: Optional[PromptComponent] = None,
        bundle_input: Optional[List[PromptComponent]] = None,
    ) -> Tuple[List[PromptComponent]]:
        bundle: List[PromptComponent] = []
        if bundle_input and isinstance(bundle_input, list):
            bundle.extend(bundle_input)

        for a in [asset_1, asset_2, asset_3, asset_4, asset_5, asset_6]:
            if a is not None and isinstance(a, PromptComponent):
                bundle.append(a)

        return (bundle,)


class LibrettoPromptWeightNode:
    """Scales or sets the weight multiplier on a given LIBRETTO_ASSET."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "asset": ("LIBRETTO_ASSET",),
                "mode": (["multiply", "override"], {"default": "multiply"}),
                "weight": ("FLOAT", {"default": 1.2, "min": 0.0, "max": 5.0, "step": 0.05}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET",)
    RETURN_NAMES = ("asset",)
    FUNCTION = "adjust_weight"
    CATEGORY = "Libretto/Prompts"

    def adjust_weight(
        self,
        asset: PromptComponent,
        mode: str = "multiply",
        weight: float = 1.2,
    ) -> Tuple[PromptComponent]:
        new_weight = asset.weight * weight if mode == "multiply" else weight
        updated_comp = PromptComponent(
            id=asset.id,
            name=asset.name,
            category=asset.category,
            keywords=asset.keywords,
            description=asset.description,
            negative=asset.negative,
            weight=round(new_weight, 3),
            character_id=asset.character_id,
            lora=asset.lora,
            metadata=dict(asset.metadata),
        )
        return (updated_comp,)

