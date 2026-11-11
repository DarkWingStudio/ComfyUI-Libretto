"""Collection Selection Engine for ComfyUI-Libretto.

Provides reproducible, seed-isolated selection modes (random, weighted, sequential,
shuffle, fixed) for prompt assets without coupling to ComfyUI's generation seed.
"""

from __future__ import annotations

import random
from typing import Any, List, Optional, Sequence, TypeVar

T = TypeVar("T")


class CollectionEngine:
    """Deterministic selection engine for collections of prompt assets."""

    @staticmethod
    def select_one(
        items: Sequence[T],
        mode: str = "random",
        seed: int = 0,
        step: int = 0,
        fixed_key_or_index: Any = 0,
    ) -> Optional[T]:
        """Select a single item from a list based on mode and deterministic seed."""
        if not items:
            return None

        mode = mode.lower().strip()

        if mode == "fixed":
            return CollectionEngine._select_fixed(items, fixed_key_or_index)
        elif mode == "sequential":
            idx = step % len(items)
            return items[idx]
        elif mode == "weighted":
            return CollectionEngine._select_weighted(items, seed)
        elif mode == "shuffle":
            rng = random.Random(seed)
            indices = list(range(len(items)))
            rng.shuffle(indices)
            idx = indices[step % len(indices)]
            return items[idx]
        else:  # default "random"
            rng = random.Random(seed)
            return rng.choice(items)

    @staticmethod
    def _select_fixed(items: Sequence[T], key_or_index: Any) -> T:
        if isinstance(key_or_index, int):
            idx = max(0, min(key_or_index, len(items) - 1))
            return items[idx]

        # If it's a string ID or name, match against item attribute or dict key
        target_str = str(key_or_index).lower().strip()
        for item in items:
            if isinstance(item, dict):
                if str(item.get("id", "")).lower() == target_str or str(item.get("name", "")).lower() == target_str:
                    return item
            elif hasattr(item, "id") and str(getattr(item, "id")).lower() == target_str:
                return item
            elif hasattr(item, "name") and str(getattr(item, "name")).lower() == target_str:
                return item

        # Fallback to first item
        return items[0]

    @staticmethod
    def _select_weighted(items: Sequence[T], seed: int) -> T:
        rng = random.Random(seed)
        weights: List[float] = []

        for item in items:
            w = 1.0
            if isinstance(item, dict):
                w = float(item.get("weight", 1.0))
            elif hasattr(item, "weight"):
                w = float(getattr(item, "weight", 1.0))
            weights.append(max(0.001, w))

        total_weight = sum(weights)
        cumulative = []
        acc = 0.0
        for w in weights:
            acc += w / total_weight
            cumulative.append(acc)

        r = rng.random()
        for idx, threshold in enumerate(cumulative):
            if r <= threshold:
                return items[idx]

        return items[-1]

