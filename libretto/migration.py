"""Legacy migration manager for ComfyUI-Libretto."""

from __future__ import annotations

import hashlib
import json
import logging
import os
from typing import Any, Dict, List, Optional

import sys

# Ensure package root is in sys.path for direct script execution
_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

try:
    # pyrefly: ignore[missing-import]
    from .hashing import calculate_entry_hash
    from .models import CURRENT_SCHEMA_VERSION, LibraryEntry
    # pyrefly: ignore[missing-import]
    from .repository import LibraryRepository
    # pyrefly: ignore[missing-import]
    from .validation import validate_entry_payload
except (ImportError, ValueError):
    # pyrefly: ignore[missing-import]
    from libretto.hashing import calculate_entry_hash
    # pyrefly: ignore[missing-import]
    from libretto.models import CURRENT_SCHEMA_VERSION, LibraryEntry
    # pyrefly: ignore[missing-import]
    from libretto.repository import LibraryRepository
    # pyrefly: ignore[missing-import]
    from libretto.validation import validate_entry_payload

logger = logging.getLogger("ComfyUI-Libretto")


class MigrationManager:
    """Handles discovery, preview, backup, execution, and rollback of legacy migrations."""

    def __init__(self, repository: LibraryRepository):
        self.repository = repository

    def discover_legacy_sources(self, search_paths: Optional[List[str]] = None) -> List[str]:
        """
        Scan common locations for legacy workflow or composition files.
        Looks for .json files that are workflows but not yet managed by Libretto.
        """
        candidates: List[str] = []
        if not search_paths:
            # By default, check custom_nodes or workspace workflow directories
            legacy_dir = os.path.join(self.repository.root_dir, "legacy")
            search_paths = [legacy_dir] if os.path.exists(legacy_dir) else []

        for base in search_paths:
            if not os.path.exists(base):
                continue
            for root, _, files in os.walk(base):
                for f in files:
                    if f.endswith(".json") and not f.startswith("."):
                        candidates.append(os.path.join(root, f))
        return candidates

    def inspect_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Attempt to read and detect the format of a potential workflow/composition file."""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            return None

        # Check if already a Libretto v1 entry
        if isinstance(data, dict) and data.get("schema_version") == CURRENT_SCHEMA_VERSION and "workflow" in data:
            return {
                "format": "libretto_v1",
                "title": data.get("title", os.path.splitext(os.path.basename(file_path))[0]),
                "data": data,
                "file_path": file_path,
            }

        # Check if ComfyUI standard workflow (UI format with "nodes")
        if isinstance(data, dict) and ("nodes" in data or "last_node_id" in data):
            title = os.path.splitext(os.path.basename(file_path))[0].replace("_", " ").title()
            return {
                "format": "comfyui_ui_workflow",
                "title": title,
                "data": data,
                "file_path": file_path,
            }

        # Check if ComfyUI API prompt format (dictionary mapping node ids to class_type & inputs)
        if isinstance(data, dict) and any(
            isinstance(v, dict) and "class_type" in v for v in data.values()
        ):
            title = os.path.splitext(os.path.basename(file_path))[0].replace("_", " ").title()
            return {
                "format": "comfyui_api_workflow",
                "title": title,
                "data": data,
                "file_path": file_path,
            }

        return None

    def _convert_to_entry_payload(self, inspected: Dict[str, Any]) -> Dict[str, Any]:
        """Generate standardized Libretto entry payload from inspected legacy file."""
        fmt = inspected["format"]
        title = inspected["title"]
        wf_data = inspected["data"]
        path = inspected.get("file_path", "")
        det_id = f"mig_{hashlib.sha256(os.path.abspath(path).encode('utf-8')).hexdigest()[:16]}"

        if fmt == "libretto_v1":
            res = dict(wf_data)
            if "id" not in res:
                res["id"] = det_id
            return res

        return {
            "schema_version": CURRENT_SCHEMA_VERSION,
            "id": det_id,
            "title": title,
            "summary": f"Imported legacy {fmt} from {os.path.basename(path)}",
            "tags": ["legacy-import", fmt],
            "version": "1.0.0",
            "source": {"kind": "migration", "origin": path},
            "workflow": {"format": fmt, "data": wf_data},
        }

    def preview_migration(self, files: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Dry-run inspection of files to be migrated.
        Returns detailed summary counts and plan without modifying storage.
        """
        if files is None:
            files = self.discover_legacy_sources()

        plan: List[Dict[str, Any]] = []
        unsupported: List[str] = []
        existing_manifest = self.repository.get_manifest()
        existing_hashes = {e.content_hash for e in existing_manifest.entries}

        for path in files:
            inspected = self.inspect_file(path)
            if not inspected:
                unsupported.append(path)
                continue

            entry_payload = self._convert_to_entry_payload(inspected)
            is_valid, errs, warns, sanitized = validate_entry_payload(entry_payload)
            entry_model = LibraryEntry.from_dict(sanitized)
            content_hash = calculate_entry_hash(entry_model.to_dict())
            is_duplicate = content_hash in existing_hashes

            plan.append({
                "source_path": path,
                "format": inspected["format"],
                "title": sanitized.get("title", inspected["title"]),
                "is_valid": is_valid,
                "is_duplicate": is_duplicate,
                "errors": errs,
                "warnings": warns,
                "required_nodes": sanitized.get("requirements", {}).get("node_classes", []),
            })

        return {
            "total_files": len(files),
            "convertible_count": sum(1 for p in plan if p["is_valid"] and not p["is_duplicate"]),
            "duplicate_count": sum(1 for p in plan if p["is_duplicate"]),
            "unsupported_count": len(unsupported),
            "unsupported_files": unsupported,
            "plan": plan,
        }

    def run_migration(
        self, files: Optional[List[str]] = None, backup_tag: str = "migration"
    ) -> Dict[str, Any]:
        """
        Execute migration with safe backup and all-or-nothing rollback on critical errors.
        """
        preview = self.preview_migration(files)
        backup_id = self.repository.create_backup(tag=backup_tag)

        created_entries: List[str] = []
        skipped_duplicates: List[str] = []
        failed: List[Dict[str, Any]] = []

        try:
            for item in preview["plan"]:
                if item["is_duplicate"]:
                    skipped_duplicates.append(item["source_path"])
                    continue
                if not item["is_valid"]:
                    failed.append({
                        "file": item["source_path"],
                        "errors": item["errors"],
                    })
                    continue

                inspected = self.inspect_file(item["source_path"])
                if not inspected:
                    continue

                payload = self._convert_to_entry_payload(inspected)
                entry = self.repository.create_entry(payload)
                created_entries.append(entry.id)

        except Exception as e:
            logger.error("Migration failed unexpectedly, attempting rollback: %s", e)
            try:
                self.repository.restore_backup(backup_id)
            except Exception as rb_err:
                logger.critical("Rollback also failed: %s", rb_err)
            raise

        return {
            "status": "completed",
            "backup_id": backup_id,
            "converted_count": len(created_entries),
            "skipped_duplicates_count": len(skipped_duplicates),
            "failed_count": len(failed),
            "created_entry_ids": created_entries,
            "failures": failed,
        }
