"""Collection nodes for ComfyUI-Libretto.

Enables reproducible selection (random, weighted, sequential, shuffle, fixed)
from a pool of prompt assets or directly from library categories using an independent collection seed.
"""

from __future__ import annotations

import os
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional, Tuple

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

from libretto.collections.engine import CollectionEngine
from libretto.compiler.components import PromptComponent
from libretto.library.preset_store import PresetStore

_cached_store: Optional[PresetStore] = None


def get_preset_store() -> PresetStore:
    global _cached_store
    if _cached_store is None:
        bundled_dir = Path(os.path.join(_pkg_dir, "library_presets"))
        user_dir = Path(os.path.join(_pkg_dir, "user_presets"))
        _cached_store = PresetStore(bundled_dir, user_presets_dir=user_dir)
    return _cached_store


CATEGORIES_LIST = [
    "characters",
    "costumes",
    "hairstyles",
    "emotions",
    "poses",
    "lighting",
    "locations",
    "situations",
    "styles",
    "views",
    "props",
]


class LibrettoCollectionNode:
    """Selects an asset from a pool using deterministic modes (random, weighted, sequential, fixed)."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "mode": (["random", "weighted", "sequential", "shuffle", "fixed"], {"default": "random"}),
                "collection_seed": ("INT", {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
            },
            "optional": {
                "step": ("INT", {"default": 0, "min": 0, "max": 1000000}),
                "fixed_index": ("INT", {"default": 0, "min": 0, "max": 1000}),
                "asset_1": ("LIBRETTO_ASSET",),
                "asset_2": ("LIBRETTO_ASSET",),
                "asset_3": ("LIBRETTO_ASSET",),
                "asset_4": ("LIBRETTO_ASSET",),
                "asset_5": ("LIBRETTO_ASSET",),
                "asset_6": ("LIBRETTO_ASSET",),
                "bundle_input": ("LIBRETTO_ASSETS",),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET", "STRING")
    RETURN_NAMES = ("asset", "selected_name")
    FUNCTION = "select_asset"
    CATEGORY = "Libretto/Collections"

    def select_asset(
        self,
        mode: str = "random",
        collection_seed: int = 0,
        step: int = 0,
        fixed_index: int = 0,
        asset_1: Optional[PromptComponent] = None,
        asset_2: Optional[PromptComponent] = None,
        asset_3: Optional[PromptComponent] = None,
        asset_4: Optional[PromptComponent] = None,
        asset_5: Optional[PromptComponent] = None,
        asset_6: Optional[PromptComponent] = None,
        bundle_input: Optional[List[PromptComponent]] = None,
    ) -> Tuple[PromptComponent, str]:
        pool: List[PromptComponent] = []

        if bundle_input and isinstance(bundle_input, list):
            pool.extend([item for item in bundle_input if isinstance(item, PromptComponent)])

        for a in [asset_1, asset_2, asset_3, asset_4, asset_5, asset_6]:
            if a is not None and isinstance(a, PromptComponent):
                pool.append(a)

        if not pool:
            fallback = PromptComponent(name="Empty Asset", keywords="")
            return (fallback, "Empty Asset")

        selected = CollectionEngine.select_one(
            items=pool,
            mode=mode,
            seed=collection_seed,
            step=step,
            fixed_key_or_index=fixed_index,
        )

        if selected is None:
            selected = pool[0]

        return (selected, selected.name)


class LibrettoCategoryCollectionNode:
    """Selects an asset dynamically from an entire library category (costumes, hairstyles, poses, etc.)."""

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Any]:
        return {
            "required": {
                "category": (CATEGORIES_LIST, {"default": "costumes"}),
                "mode": (["random", "weighted", "sequential", "shuffle", "fixed"], {"default": "random"}),
                "collection_seed": ("INT", {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF}),
            },
            "optional": {
                "step": ("INT", {"default": 0, "min": 0, "max": 1000000}),
                "fixed_index": ("INT", {"default": 0, "min": 0, "max": 1000}),
                "filter_query": ("STRING", {"default": "", "multiline": False}),
                "source": (["all", "bundled", "user"], {"default": "all"}),
            },
        }

    RETURN_TYPES = ("LIBRETTO_ASSET", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("asset", "name", "keywords", "negative")
    FUNCTION = "select_from_category"
    CATEGORY = "Libretto/Collections"

    def select_from_category(
        self,
        category: str = "costumes",
        mode: str = "random",
        collection_seed: int = 0,
        step: int = 0,
        fixed_index: int = 0,
        filter_query: str = "",
        source: str = "all",
    ) -> Tuple[PromptComponent, str, str, str]:
        store = get_preset_store()
        res = store.list_presets(
            category=category,
            query=filter_query,
            limit=2000,
            source=source,
        )
        items = res.get("items", [])

        if not items:
            empty = PromptComponent(
                name=f"Empty {category}",
                category=category,
                keywords="",
                negative="",
            )
            return (empty, empty.name, "", "")

        # Convert preset dicts to PromptComponents
        components: List[PromptComponent] = []
        for it in items:
            comp = PromptComponent(
                id=it["id"],
                name=it["name"],
                category=it.get("category", category),
                keywords=it.get("keywords", ""),
                negative=it.get("negative", ""),
                weight=float(it.get("weight", 1.0)),
                metadata={"source": it.get("source", "bundled"), "is_custom": it.get("is_custom", False)},
            )
            components.append(comp)

        selected = CollectionEngine.select_one(
            items=components,
            mode=mode,
            seed=collection_seed,
            step=step,
            fixed_key_or_index=fixed_index,
        )

        if selected is None:
            selected = components[0]

        return (selected, selected.name, selected.keywords, selected.negative)
