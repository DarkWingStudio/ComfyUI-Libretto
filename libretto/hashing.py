"""Canonical hashing utilities for ComfyUI-Libretto."""

from __future__ import annotations

import hashlib
import json
from typing import Any, Dict


def canonical_json_dumps(obj: Any) -> str:
    """Serialize Python data structure to deterministic canonical JSON."""
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def calculate_entry_hash(entry_dict: Dict[str, Any]) -> str:
    """
    Compute sha256 checksum over canonical entry content.
    Excludes mutable and instance-specific fields: content_hash, updated_at, created_at, id.
    """
    normalized = {}
    excluded_fields = {"content_hash", "updated_at", "created_at", "id"}

    for k, v in entry_dict.items():
        if k in excluded_fields:
            continue
        normalized[k] = v

    canonical_str = canonical_json_dumps(normalized)
    digest = hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()
    return f"sha256:{digest}"
