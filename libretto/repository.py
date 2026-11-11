"""Storage repository for ComfyUI-Libretto."""

from __future__ import annotations

import json
import logging
import os
import shutil
import tempfile
import threading
from typing import Any, Dict, List, Optional, Tuple

# pyrefly: ignore[missing-import]
from .hashing import calculate_entry_hash, canonical_json_dumps
from .models import (
    CURRENT_SCHEMA_VERSION,
    LibraryEntry,
    LibraryManifest,
    ManifestEntryRef,
    current_iso_timestamp,
)
# pyrefly: ignore[missing-import]
from .validation import (
    generate_entry_id,
    sanitize_id,
    validate_entry_payload,
)

logger = logging.getLogger("ComfyUI-Libretto")


class StorageError(Exception):
    """Base exception for storage errors."""
    pass


class ConcurrencyConflictError(StorageError):
    """Raised when an update/delete fails an optimistic concurrency check."""
    pass


class NotFoundError(StorageError):
    """Raised when an entry is not found."""
    pass


class LibraryRepository:
    """
    Manages persistence of Libretto compositions on disk using per-entry JSON files,
    an atomic manifest, and safe asset handling.
    """

    def __init__(self, root_dir: str):
        self.root_dir = os.path.abspath(root_dir)
        self.entries_dir = os.path.join(self.root_dir, "entries")
        self.assets_dir = os.path.join(self.root_dir, "assets")
        self.backups_dir = os.path.join(self.root_dir, "backups")
        self.manifest_path = os.path.join(self.root_dir, "manifest.json")
        self._lock = threading.RLock()
        self.init_storage()

    def init_storage(self) -> None:
        """Create directory structure and verify or build manifest."""
        os.makedirs(self.entries_dir, exist_ok=True)
        os.makedirs(self.assets_dir, exist_ok=True)
        os.makedirs(self.backups_dir, exist_ok=True)

        with self._lock:
            if not os.path.exists(self.manifest_path):
                self.rebuild_manifest()
            else:
                try:
                    with open(self.manifest_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    LibraryManifest.from_dict(data)
                except Exception as e:
                    logger.warning(
                        "Manifest was missing or corrupt. Rebuilding: %s", e
                    )
                    self.rebuild_manifest()

    def _atomic_write_json(self, target_path: str, data: Any) -> None:
        """Atomically write JSON data to file using a temporary file in the same directory."""
        dir_name = os.path.dirname(target_path)
        os.makedirs(dir_name, exist_ok=True)

        serialized = json.dumps(data, indent=2, ensure_ascii=False)
        temp_fd, temp_path = tempfile.mkstemp(dir=dir_name, prefix=".tmp_libretto_")
        try:
            with os.fdopen(temp_fd, "w", encoding="utf-8") as f:
                f.write(serialized)
                f.flush()
                os.fsync(f.fileno())
            os.replace(temp_path, target_path)
        except Exception:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    pass
            raise

    def get_manifest(self) -> LibraryManifest:
        """Read and return manifest."""
        with self._lock:
            if not os.path.exists(self.manifest_path):
                return self.rebuild_manifest()
            try:
                with open(self.manifest_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                return LibraryManifest.from_dict(data)
            except Exception as e:
                logger.warning("Manifest read error, rebuilding: %s", e)
                return self.rebuild_manifest()

    def save_manifest(self, manifest: LibraryManifest) -> None:
        """Save manifest atomically."""
        with self._lock:
            manifest.updated_at = current_iso_timestamp()
            self._atomic_write_json(self.manifest_path, manifest.to_dict())

    def rebuild_manifest(self) -> LibraryManifest:
        """
        Rebuild manifest by scanning all files in the entries directory.
        Quarantines unreadable files.
        """
        with self._lock:
            entries_ref: List[ManifestEntryRef] = []
            if os.path.exists(self.entries_dir):
                for filename in os.listdir(self.entries_dir):
                    if not filename.endswith(".json"):
                        continue
                    file_path = os.path.join(self.entries_dir, filename)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            entry_data = json.load(f)
                        entry = LibraryEntry.from_dict(entry_data)
                        if not entry.id:
                            entry.id = os.path.splitext(filename)[0]

                        # Verify or repair content_hash
                        computed_hash = calculate_entry_hash(entry.to_dict())
                        if entry.content_hash != computed_hash:
                            entry.content_hash = computed_hash
                            self._atomic_write_json(file_path, entry.to_dict())

                        req_count = len(entry.requirements.node_classes)
                        ref = ManifestEntryRef(
                            id=entry.id,
                            title=entry.title,
                            path=f"entries/{filename}",
                            content_hash=entry.content_hash,
                            tags=entry.tags,
                            version=entry.version,
                            updated_at=entry.updated_at,
                            requirements_count=req_count,
                            preview=entry.assets.preview,
                        )
                        entries_ref.append(ref)
                    except Exception as e:
                        logger.error(
                            "Failed to parse entry file %s during manifest rebuild: %s",
                            filename,
                            e,
                        )

            # Sort entries by updated_at descending
            entries_ref.sort(key=lambda x: x.updated_at, reverse=True)
            manifest = LibraryManifest(
                schema_version=CURRENT_SCHEMA_VERSION,
                library_id="default",
                updated_at=current_iso_timestamp(),
                entries=entries_ref,
            )
            self._atomic_write_json(self.manifest_path, manifest.to_dict())
            return manifest

    def _entry_path(self, entry_id: str) -> str:
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            raise ValueError(f"Invalid entry ID: {entry_id}")
        return os.path.join(self.entries_dir, f"{safe_id}.json")

    def list_entries(
        self,
        q: str = "",
        tag: str = "",
        sort: str = "updated_at",
        limit: int = 50,
        cursor: int = 0,
    ) -> Tuple[List[Dict[str, Any]], int, Optional[int]]:
        """
        List/search entries from manifest.
        Returns (items, total_count, next_cursor).
        """
        manifest = self.get_manifest()
        filtered = manifest.entries

        # Filter by search query in title, tags, or id
        if q:
            q_clean = q.strip().lower()
            filtered = [
                e
                for e in filtered
                if q_clean in e.title.lower()
                or any(q_clean in t.lower() for t in e.tags)
                or q_clean in e.id.lower()
            ]

        # Filter by tag
        if tag:
            tag_clean = tag.strip().lower()
            filtered = [
                e
                for e in filtered
                if any(tag_clean == t.lower() for t in e.tags)
            ]

        # Sort
        if sort == "title":
            filtered.sort(key=lambda x: x.title.lower())
        elif sort == "title_desc":
            filtered.sort(key=lambda x: x.title.lower(), reverse=True)
        elif sort == "created":
            filtered.sort(key=lambda x: x.updated_at)
        else:  # default: updated_at desc
            filtered.sort(key=lambda x: x.updated_at, reverse=True)

        total = len(filtered)
        start = max(0, cursor)
        end = start + max(1, limit)
        paged = filtered[start:end]
        next_cursor = end if end < total else None

        items = [ref.to_dict() for ref in paged]
        return items, total, next_cursor

    def get_entry(self, entry_id: str) -> LibraryEntry:
        """Read a single entry from disk."""
        target_path = self._entry_path(entry_id)
        with self._lock:
            if not os.path.exists(target_path):
                raise NotFoundError(f"Libretto composition '{entry_id}' not found.")
            try:
                with open(target_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                return LibraryEntry.from_dict(data)
            except Exception as e:
                raise StorageError(f"Error reading entry '{entry_id}': {e}") from e

    def create_entry(self, raw_data: Dict[str, Any]) -> LibraryEntry:
        """Validate and write a new entry, updating the manifest."""
        is_valid, errors, _, sanitized = validate_entry_payload(raw_data, is_update=False)
        if not is_valid:
            raise ValueError(f"Validation failed: {', '.join(errors)}")

        entry_id = sanitized["id"]
        target_path = self._entry_path(entry_id)

        with self._lock:
            if os.path.exists(target_path):
                entry_id = generate_entry_id()
                sanitized["id"] = entry_id
                target_path = self._entry_path(entry_id)

            now_str = current_iso_timestamp()
            sanitized["created_at"] = now_str
            sanitized["updated_at"] = now_str

            entry = LibraryEntry.from_dict(sanitized)
            entry.content_hash = calculate_entry_hash(entry.to_dict())

            self._atomic_write_json(target_path, entry.to_dict())

            # Update manifest
            manifest = self.get_manifest()
            ref = ManifestEntryRef(
                id=entry.id,
                title=entry.title,
                path=f"entries/{entry.id}.json",
                content_hash=entry.content_hash,
                tags=entry.tags,
                version=entry.version,
                updated_at=entry.updated_at,
                requirements_count=len(entry.requirements.node_classes),
                preview=entry.assets.preview,
            )
            # Prepend newest
            manifest.entries = [ref] + [e for e in manifest.entries if e.id != entry.id]
            self.save_manifest(manifest)

            return entry

    def update_entry(
        self, entry_id: str, raw_data: Dict[str, Any], expected_hash: Optional[str] = None
    ) -> LibraryEntry:
        """Update an existing entry with optional optimistic locking via expected_hash."""
        target_path = self._entry_path(entry_id)

        with self._lock:
            if not os.path.exists(target_path):
                raise NotFoundError(f"Libretto composition '{entry_id}' not found.")

            existing_entry = self.get_entry(entry_id)
            if expected_hash and existing_entry.content_hash != expected_hash:
                raise ConcurrencyConflictError(
                    f"Conflict: Entry hash has changed (expected {expected_hash}, current {existing_entry.content_hash})."
                )

            # Prepare update payload
            raw_data["id"] = entry_id
            is_valid, errors, _, sanitized = validate_entry_payload(raw_data, is_update=True)
            if not is_valid:
                raise ValueError(f"Validation failed: {', '.join(errors)}")

            sanitized["created_at"] = existing_entry.created_at
            sanitized["updated_at"] = current_iso_timestamp()

            updated_entry = LibraryEntry.from_dict(sanitized)
            updated_entry.content_hash = calculate_entry_hash(updated_entry.to_dict())

            self._atomic_write_json(target_path, updated_entry.to_dict())

            # Update manifest
            manifest = self.get_manifest()
            new_ref = ManifestEntryRef(
                id=updated_entry.id,
                title=updated_entry.title,
                path=f"entries/{updated_entry.id}.json",
                content_hash=updated_entry.content_hash,
                tags=updated_entry.tags,
                version=updated_entry.version,
                updated_at=updated_entry.updated_at,
                requirements_count=len(updated_entry.requirements.node_classes),
                preview=updated_entry.assets.preview,
            )
            manifest.entries = [
                new_ref if e.id == entry_id else e for e in manifest.entries
            ]
            self.save_manifest(manifest)

            return updated_entry

    def delete_entry(
        self, entry_id: str, expected_hash: Optional[str] = None
    ) -> None:
        """Delete an entry and remove it from manifest."""
        target_path = self._entry_path(entry_id)

        with self._lock:
            if not os.path.exists(target_path):
                raise NotFoundError(f"Libretto composition '{entry_id}' not found.")

            if expected_hash:
                entry = self.get_entry(entry_id)
                if entry.content_hash != expected_hash:
                    raise ConcurrencyConflictError("Conflict: Entry hash mismatch.")

            try:
                os.remove(target_path)
            except OSError as e:
                raise StorageError(f"Failed to delete {target_path}: {e}") from e

            manifest = self.get_manifest()
            manifest.entries = [e for e in manifest.entries if e.id != entry_id]
            self.save_manifest(manifest)

    def save_preview(
        self, entry_id: str, filename: str, image_bytes: bytes
    ) -> str:
        """
        Securely save preview image into assets folder.
        Returns relative path, e.g. 'assets/<clean_filename>'.
        """
        safe_id = sanitize_id(entry_id)
        if not safe_id:
            raise ValueError(f"Invalid entry id: {entry_id}")

        ext = os.path.splitext(filename)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp"):
            ext = ".png"

        clean_filename = f"{safe_id}_preview{ext}"
        target_path = os.path.join(self.assets_dir, clean_filename)

        with open(target_path, "wb") as f:
            f.write(image_bytes)

        rel_path = f"assets/{clean_filename}"
        # Update entry's asset preview
        try:
            entry = self.get_entry(entry_id)
            entry_dict = entry.to_dict()
            entry_dict["assets"]["preview"] = rel_path
            self.update_entry(entry_id, entry_dict)
        except Exception as e:
            logger.warning("Could not automatically update entry asset: %s", e)

        return rel_path

    def create_backup(self, tag: str = "auto") -> str:
        """
        Create a timestamped backup of all entries and manifest.
        Returns backup_id.
        """
        import datetime
        now_tag = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d_%H%M%S")
        clean_tag = "".join(c for c in tag if c.isalnum() or c in ("-", "_"))[:20] or "backup"
        backup_id = f"bak_{now_tag}_{clean_tag}"
        target_dir = os.path.join(self.backups_dir, backup_id)

        with self._lock:
            os.makedirs(target_dir, exist_ok=True)
            if os.path.exists(self.manifest_path):
                shutil.copy2(self.manifest_path, os.path.join(target_dir, "manifest.json"))
            target_entries_dir = os.path.join(target_dir, "entries")
            os.makedirs(target_entries_dir, exist_ok=True)
            if os.path.exists(self.entries_dir):
                for f in os.listdir(self.entries_dir):
                    if f.endswith(".json"):
                        shutil.copy2(
                            os.path.join(self.entries_dir, f),
                            os.path.join(target_entries_dir, f),
                        )
        return backup_id

    def restore_backup(self, backup_id: str) -> None:
        """Restore storage state from a named backup."""
        safe_backup_id = sanitize_id(backup_id)
        if not safe_backup_id:
            raise ValueError(f"Invalid backup ID: {backup_id}")
        source_dir = os.path.join(self.backups_dir, safe_backup_id)
        if not os.path.isdir(source_dir):
            raise NotFoundError(f"Backup directory {safe_backup_id} not found.")

        with self._lock:
            source_entries = os.path.join(source_dir, "entries")
            if os.path.isdir(source_entries):
                for f in os.listdir(source_entries):
                    if f.endswith(".json"):
                        shutil.copy2(
                            os.path.join(source_entries, f),
                            os.path.join(self.entries_dir, f),
                        )
            src_manifest = os.path.join(source_dir, "manifest.json")
            if os.path.exists(src_manifest):
                shutil.copy2(src_manifest, self.manifest_path)
            self.rebuild_manifest()

    def get_storage_stats(self) -> Dict[str, Any]:
        """Return diagnostic storage statistics."""
        manifest = self.get_manifest()
        backups = [
            b
            for b in os.listdir(self.backups_dir)
            if os.path.isdir(os.path.join(self.backups_dir, b))
        ] if os.path.exists(self.backups_dir) else []

        total_bytes = 0
        for dirpath, _, filenames in os.walk(self.root_dir):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total_bytes += os.path.getsize(fp)

        return {
            "root_dir": self.root_dir,
            "total_entries": len(manifest.entries),
            "total_backups": len(backups),
            "disk_usage_bytes": total_bytes,
            "schema_version": CURRENT_SCHEMA_VERSION,
        }
