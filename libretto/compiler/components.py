"""Component definitions for prompt compilation in ComfyUI-Libretto."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
import datetime
from typing import Any, Dict, List, Optional


@dataclass
class PromptComponent:
    """A structured building block of a prompt (preset, attribute, or custom text)."""
    id: str = ""
    name: str = ""
    category: str = "custom"
    keywords: str = ""
    description: str = ""
    negative: str = ""
    weight: float = 1.0
    character_id: Optional[str] = None
    hair_color: Optional[str] = None
    lora: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> PromptComponent:
        return cls(
            id=str(data.get("id", "")),
            name=str(data.get("name", "")),
            category=str(data.get("category", "custom")).lower(),
            keywords=str(data.get("keywords", "")),
            description=str(data.get("description", "")),
            negative=str(data.get("negative", "")),
            weight=float(data.get("weight", 1.0)),
            character_id=data.get("character_id"),
            hair_color=data.get("hair_color"),
            lora=data.get("lora"),
            metadata=dict(data.get("metadata", {})),
        )


@dataclass
class CompiledPrompt:
    """The result of compiling structured prompt components using a model profile."""
    positive: str
    negative: str
    profile_id: str
    format_style: str
    components_used: List[Dict[str, Any]] = field(default_factory=list)
    loras: List[Dict[str, Any]] = field(default_factory=list)
    generation_snapshot: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

