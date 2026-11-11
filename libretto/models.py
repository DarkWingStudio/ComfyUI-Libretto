"""Data models for ComfyUI-Libretto."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
import datetime
from typing import Any, Dict, List, Optional


CURRENT_SCHEMA_VERSION = 1
MAX_TITLE_LENGTH = 120
MAX_SUMMARY_LENGTH = 2000
MAX_TAG_LENGTH = 50
MAX_TAGS_COUNT = 30
MAX_PAYLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


def current_iso_timestamp() -> str:
    """Return current UTC time in ISO 8601 format."""
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


@dataclass
class EntrySource:
    kind: str = "local"
    origin: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> EntrySource:
        if not data:
            return cls()
        return cls(
            kind=str(data.get("kind", "local")),
            origin=data.get("origin"),
        )


@dataclass
class CompatibilitySpec:
    comfyui: str = ">=0.3.0"
    libretto: str = ">=1.0.0"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> CompatibilitySpec:
        if not data:
            return cls()
        return cls(
            comfyui=str(data.get("comfyui", ">=0.3.0")),
            libretto=str(data.get("libretto", ">=1.0.0")),
        )


@dataclass
class RequirementsSpec:
    node_classes: List[str] = field(default_factory=list)
    models: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> RequirementsSpec:
        if not data:
            return cls()
        return cls(
            node_classes=list(data.get("node_classes", [])),
            models=list(data.get("models", [])),
        )


@dataclass
class InterfaceItem:
    name: str
    value_type: str = "STRING"
    description: Optional[str] = None
    default_value: Any = None
    node_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> InterfaceItem:
        return cls(
            name=str(data.get("name", "")),
            value_type=str(data.get("value_type", "STRING")),
            description=data.get("description"),
            default_value=data.get("default_value"),
            node_id=str(data.get("node_id")) if data.get("node_id") is not None else None,
        )


@dataclass
class InterfacesSpec:
    inputs: List[InterfaceItem] = field(default_factory=list)
    outputs: List[InterfaceItem] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "inputs": [item.to_dict() for item in self.inputs],
            "outputs": [item.to_dict() for item in self.outputs],
        }

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> InterfacesSpec:
        if not data:
            return cls()
        return cls(
            inputs=[InterfaceItem.from_dict(i) for i in data.get("inputs", []) if isinstance(i, dict)],
            outputs=[InterfaceItem.from_dict(o) for o in data.get("outputs", []) if isinstance(o, dict)],
        )


@dataclass
class WorkflowData:
    format: str = "comfyui-json"
    data: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> WorkflowData:
        if not data:
            return cls()
        return cls(
            format=str(data.get("format", "comfyui-json")),
            data=data.get("data", {}) if isinstance(data.get("data"), dict) else {},
        )


@dataclass
class AssetSpec:
    preview: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> AssetSpec:
        if not data:
            return cls()
        return cls(preview=data.get("preview"))


@dataclass
class LibraryEntry:
    id: str
    title: str
    summary: str = ""
    tags: List[str] = field(default_factory=list)
    version: str = "1.0.0"
    created_at: str = field(default_factory=current_iso_timestamp)
    updated_at: str = field(default_factory=current_iso_timestamp)
    schema_version: int = CURRENT_SCHEMA_VERSION
    source: EntrySource = field(default_factory=EntrySource)
    compatibility: CompatibilitySpec = field(default_factory=CompatibilitySpec)
    requirements: RequirementsSpec = field(default_factory=RequirementsSpec)
    interfaces: InterfacesSpec = field(default_factory=InterfacesSpec)
    workflow: WorkflowData = field(default_factory=WorkflowData)
    assets: AssetSpec = field(default_factory=AssetSpec)
    content_hash: str = ""

    def to_dict(self, include_workflow: bool = True) -> Dict[str, Any]:
        res: Dict[str, Any] = {
            "schema_version": self.schema_version,
            "id": self.id,
            "title": self.title,
            "summary": self.summary,
            "tags": list(self.tags),
            "version": self.version,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "source": self.source.to_dict(),
            "compatibility": self.compatibility.to_dict(),
            "requirements": self.requirements.to_dict(),
            "interfaces": self.interfaces.to_dict(),
            "assets": self.assets.to_dict(),
            "content_hash": self.content_hash,
        }
        if include_workflow:
            res["workflow"] = self.workflow.to_dict()
        return res

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> LibraryEntry:
        return cls(
            id=str(data.get("id", "")),
            title=str(data.get("title", "")),
            summary=str(data.get("summary", "")),
            tags=list(data.get("tags", [])),
            version=str(data.get("version", "1.0.0")),
            created_at=str(data.get("created_at", current_iso_timestamp())),
            updated_at=str(data.get("updated_at", current_iso_timestamp())),
            schema_version=int(data.get("schema_version", CURRENT_SCHEMA_VERSION)),
            source=EntrySource.from_dict(data.get("source")),
            compatibility=CompatibilitySpec.from_dict(data.get("compatibility")),
            requirements=RequirementsSpec.from_dict(data.get("requirements")),
            interfaces=InterfacesSpec.from_dict(data.get("interfaces")),
            workflow=WorkflowData.from_dict(data.get("workflow")),
            assets=AssetSpec.from_dict(data.get("assets")),
            content_hash=str(data.get("content_hash", "")),
        )


@dataclass
class ManifestEntryRef:
    id: str
    title: str
    path: str
    content_hash: str
    tags: List[str] = field(default_factory=list)
    version: str = "1.0.0"
    updated_at: str = ""
    requirements_count: int = 0
    preview: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> ManifestEntryRef:
        return cls(
            id=str(data.get("id", "")),
            title=str(data.get("title", "")),
            path=str(data.get("path", "")),
            content_hash=str(data.get("content_hash", "")),
            tags=list(data.get("tags", [])),
            version=str(data.get("version", "1.0.0")),
            updated_at=str(data.get("updated_at", "")),
            requirements_count=int(data.get("requirements_count", 0)),
            preview=data.get("preview"),
        )


@dataclass
class LibraryManifest:
    schema_version: int = CURRENT_SCHEMA_VERSION
    library_id: str = "default"
    updated_at: str = field(default_factory=current_iso_timestamp)
    entries: List[ManifestEntryRef] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "library_id": self.library_id,
            "updated_at": self.updated_at,
            "entries": [e.to_dict() for e in self.entries],
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> LibraryManifest:
        return cls(
            schema_version=int(data.get("schema_version", CURRENT_SCHEMA_VERSION)),
            library_id=str(data.get("library_id", "default")),
            updated_at=str(data.get("updated_at", current_iso_timestamp())),
            entries=[
                ManifestEntryRef.from_dict(e)
                for e in data.get("entries", [])
                if isinstance(e, dict)
            ],
        )
