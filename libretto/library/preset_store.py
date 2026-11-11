"""Preset store for loading, querying, saving, and managing bundled and user Libretto prompt presets."""

from __future__ import annotations

import io
import json
import os
from pathlib import Path
import re
import time
from typing import Any, Dict, List, Optional
import zipfile
import yaml

# pyrefly: ignore[missing-import]
from ..profiles.profile import DEFAULT_CATEGORY_ORDER

_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]*$")
SAFE_FOLDER_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
MAX_PACK_BYTES = 50 * 1024 * 1024
MAX_MEMBER_BYTES = 5 * 1024 * 1024


def slugify_id(text: str) -> str:
    """Generate a clean slug identifier from a string."""
    clean = re.sub(r"[^a-zA-Z0-9_-]+", "-", text.strip().lower()).strip("-_")
    if not clean:
        clean = f"preset-{int(time.time())}"
    return clean


class PresetStore:
    """Manages prompt presets organized into categories (characters, costumes, poses, etc.)."""

    def __init__(self, root_dir: Path, user_presets_dir: Optional[Path] = None) -> None:
        self.root_dir = Path(root_dir)
        self.user_presets_dir = (
            Path(user_presets_dir) if user_presets_dir else self.root_dir.parent / "user_presets"
        )
        self.user_presets_dir.mkdir(parents=True, exist_ok=True)

        self.categories_file = self.root_dir / "categories.yaml"
        self.tags_file = self.root_dir / "tags.yaml"
        self._categories: List[Dict[str, Any]] = []
        self._tags: Dict[str, Any] = {}
        self.reload()

    def reload(self) -> None:
        """Reload categories, tags, and index."""
        self._categories = self._load_categories()
        self._tags = self._load_tags()

    def _load_categories(self) -> List[Dict[str, Any]]:
        if self.categories_file.exists():
            try:
                data = yaml.safe_load(self.categories_file.read_text(encoding="utf-8"))
                if isinstance(data, dict) and "categories" in data:
                    return data["categories"]
            except Exception:
                pass

        # Fallback default categories
        return [
            {
                "id": cat,
                "names": {"en-US": cat.capitalize()},
                "folder": cat,
                "color": "#7c9cf0",
                "has_color": cat == "hair",
            }
            for cat in DEFAULT_CATEGORY_ORDER
        ]

    def _load_tags(self) -> Dict[str, Any]:
        if self.tags_file.exists():
            try:
                data = yaml.safe_load(self.tags_file.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    return data
            except Exception:
                pass
        return {}

    def get_categories(self) -> List[Dict[str, Any]]:
        return list(self._categories)

    def get_category_by_id(self, cat_id: str) -> Optional[Dict[str, Any]]:
        if not cat_id:
            return None
        c_clean = str(cat_id).lower().strip()
        for cat in self._categories:
            if cat.get("id", "").lower() == c_clean or cat.get("folder", "").lower() == c_clean:
                return cat
        return None

    def get_counts(self, category: Optional[str] = None, query: str = "") -> Dict[str, int]:
        """Get counts for all, bundled, and user presets matching current filter."""
        res_all = self.list_presets(category=category, query=query, limit=1, offset=0, source="all")
        res_bundled = self.list_presets(category=category, query=query, limit=1, offset=0, source="bundled")
        res_user = self.list_presets(category=category, query=query, limit=1, offset=0, source="user")
        return {
            "all": res_all["total"],
            "bundled": res_bundled["total"],
            "user": res_user["total"],
        }

    def list_presets(
        self,
        category: Optional[str] = None,
        query: str = "",
        limit: int = 100,
        offset: int = 0,
        source: str = "all",
    ) -> Dict[str, Any]:
        """Search and list presets with pagination.
        
        Args:
            category: Optional category filter.
            query: Substring search query for name, keywords, description, or id.
            limit: Maximum items to return.
            offset: Pagination offset.
            source: 'all', 'bundled', or 'user'.
        """
        all_presets: List[Dict[str, Any]] = []
        categories_to_search = [self.get_category_by_id(category)] if category else self._categories
        q_lower = query.lower().strip()

        # Directories to search based on source filter
        search_dirs: List[tuple[Path, str, bool]] = []
        if source in ("all", "user") and self.user_presets_dir.exists():
            search_dirs.append((self.user_presets_dir, "user", True))
        if source in ("all", "bundled") and self.root_dir.exists():
            search_dirs.append((self.root_dir, "bundled", False))

        seen_keys = set()

        for base_dir, src_label, is_custom in search_dirs:
            # 1. Search known category folders
            folders_to_check: Dict[str, Dict[str, Any]] = {}
            for cat in categories_to_search:
                if cat:
                    folder_name = cat.get("folder", cat.get("id", ""))
                    if folder_name:
                        folders_to_check[folder_name] = cat

            # 2. For user presets, also search ANY other subdirectory (e.g. custom user categories)
            if is_custom and base_dir.exists():
                for sub in base_dir.iterdir():
                    if sub.is_dir() and sub.name not in folders_to_check:
                        matched_cat = self.get_category_by_id(sub.name) or {
                            "id": sub.name,
                            "folder": sub.name,
                            "names": {"en-US": sub.name.capitalize()},
                            "color": "#8b5cf6",
                        }
                        if not category or category.lower() in (sub.name.lower(), matched_cat.get("id", "").lower()):
                            folders_to_check[sub.name] = matched_cat

            for folder_name, cat in folders_to_check.items():
                cat_folder = base_dir / folder_name
                if not cat_folder.exists() or not cat_folder.is_dir():
                    continue

                for file_path in cat_folder.glob("*.yaml"):
                    preset_id = file_path.stem
                    dedup_key = (cat.get("id", folder_name), preset_id)
                    if dedup_key in seen_keys:
                        continue

                    try:
                        data = yaml.safe_load(file_path.read_text(encoding="utf-8"))
                        if not isinstance(data, dict):
                            continue

                        name = data.get("name", preset_id)
                        keywords = data.get("keywords", "")
                        description = data.get("description", "")

                        if q_lower:
                            match = (
                                q_lower in name.lower()
                                or q_lower in keywords.lower()
                                or q_lower in description.lower()
                                or q_lower in preset_id.lower()
                            )
                            if not match:
                                continue

                        has_thumb = (
                            (cat_folder / f"{preset_id}.webp").exists()
                            or (cat_folder / f"{preset_id}.png").exists()
                            or (cat_folder / f"{preset_id}.jpg").exists()
                            or (cat_folder / f"{preset_id}.jpeg").exists()
                        )

                        seen_keys.add(dedup_key)
                        all_presets.append({
                            "id": preset_id,
                            "name": name,
                            "category": cat.get("id", folder_name),
                            "keywords": keywords,
                            "description": description,
                            "negative": data.get("negative", ""),
                            "weight": float(data.get("weight", 1.0)),
                            "labels": data.get("labels", []),
                            "has_thumb": has_thumb,
                            "color": cat.get("color", "#7c9cf0"),
                            "folder": folder_name,
                            "source": src_label,
                            "is_custom": is_custom,
                        })
                    except Exception:
                        continue

        total = len(all_presets)
        paginated = all_presets[offset : offset + limit]
        return {
            "total": total,
            "items": paginated,
            "offset": offset,
            "limit": limit,
        }

    def get_preset(self, category: str, preset_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve preset metadata and properties by category and ID."""
        clean_id = preset_id[:-5] if preset_id.endswith(".yaml") else preset_id
        cat = self.get_category_by_id(category)

        # Check user presets first, then bundled
        check_dirs = [
            (self.user_presets_dir, "user", True),
            (self.root_dir, "bundled", False),
        ]

        for base_dir, src_label, is_custom in check_dirs:
            if not base_dir.exists():
                continue

            if cat:
                folder_name = cat.get("folder", cat.get("id", ""))
                candidate = base_dir / folder_name / f"{clean_id}.yaml"
                if candidate.exists():
                    try:
                        data = yaml.safe_load(candidate.read_text(encoding="utf-8"))
                        if isinstance(data, dict):
                            data["id"] = clean_id
                            data["category"] = cat.get("id")
                            data["folder"] = folder_name
                            data["source"] = src_label
                            data["is_custom"] = is_custom
                            data["has_thumb"] = any(
                                (base_dir / folder_name / f"{clean_id}{ext}").exists()
                                for ext in (".webp", ".png", ".jpg")
                            )
                            return data
                    except Exception:
                        pass

            # Direct folder candidate
            candidate = base_dir / category / f"{clean_id}.yaml"
            if candidate.exists():
                try:
                    data = yaml.safe_load(candidate.read_text(encoding="utf-8"))
                    if isinstance(data, dict):
                        data["id"] = clean_id
                        data["folder"] = category
                        data["source"] = src_label
                        data["is_custom"] = is_custom
                        data["has_thumb"] = any(
                            (base_dir / category / f"{clean_id}{ext}").exists()
                            for ext in (".webp", ".png", ".jpg")
                        )
                        return data
                except Exception:
                    pass

        return None

    def get_thumbnail_path(self, category: str, preset_id: str) -> Optional[Path]:
        """Find thumbnail file path across user and bundled presets."""
        clean_id = re.sub(r"\.(webp|png|jpg|jpeg)$", "", preset_id, flags=re.IGNORECASE)
        cat = self.get_category_by_id(category)
        exts = [".webp", ".png", ".jpg", ".jpeg"]

        check_dirs = [self.user_presets_dir, self.root_dir]

        for base_dir in check_dirs:
            if not base_dir.exists():
                continue

            # 1. Resolve via category or folder name
            if cat:
                folder_name = cat.get("folder", cat.get("id", ""))
                for ext in exts:
                    tf = base_dir / folder_name / f"{clean_id}{ext}"
                    if tf.exists():
                        return tf

            # 2. Direct folder check
            if category:
                for ext in exts:
                    direct_thumb = base_dir / category / f"{clean_id}{ext}"
                    if direct_thumb.exists():
                        return direct_thumb

            # 3. Exhaustive search across all category folders
            for c in self._categories:
                f = c.get("folder", c.get("id", ""))
                for ext in exts:
                    candidate = base_dir / f / f"{clean_id}{ext}"
                    if candidate.exists():
                        return candidate

        return None

    def save_preset(
        self,
        category: str,
        name: str,
        keywords: str,
        negative: str = "",
        weight: float = 1.0,
        preset_id: Optional[str] = None,
        description: str = "",
        labels: Optional[List[str]] = None,
        thumbnail_bytes: Optional[bytes] = None,
    ) -> Dict[str, Any]:
        """Create or update a user custom preset."""
        cat = self.get_category_by_id(category)
        if not cat:
            cat = {
                "id": slugify_id(category),
                "folder": slugify_id(category),
                "color": "#7c9cf0",
            }

        folder_name = cat.get("folder", cat.get("id", "custom"))
        target_dir = self.user_presets_dir / folder_name
        target_dir.mkdir(parents=True, exist_ok=True)

        if not preset_id or not _ID_RE.match(preset_id):
            preset_id = slugify_id(name or preset_id or "custom-preset")

        payload = {
            "name": name.strip() or preset_id,
            "keywords": keywords.strip(),
            "negative": negative.strip(),
            "weight": float(weight),
            "description": description.strip(),
            "labels": labels or [],
        }

        yaml_path = target_dir / f"{preset_id}.yaml"
        yaml_content = yaml.safe_dump(payload, allow_unicode=True, sort_keys=False)
        yaml_path.write_text(yaml_content, encoding="utf-8")

        has_thumb = False
        if thumbnail_bytes:
            ext = ".webp"
            if thumbnail_bytes.startswith(b"\x89PNG"):
                ext = ".png"
            elif thumbnail_bytes.startswith(b"\xff\xd8"):
                ext = ".jpg"
            thumb_path = target_dir / f"{preset_id}{ext}"
            thumb_path.write_bytes(thumbnail_bytes)
            has_thumb = True
        else:
            has_thumb = any(
                (target_dir / f"{preset_id}{ext}").exists()
                for ext in (".webp", ".png", ".jpg", ".jpeg")
            )

        return {
            "id": preset_id,
            "name": payload["name"],
            "category": cat.get("id"),
            "keywords": payload["keywords"],
            "negative": payload["negative"],
            "weight": payload["weight"],
            "description": payload["description"],
            "labels": payload["labels"],
            "has_thumb": has_thumb,
            "folder": folder_name,
            "source": "user",
            "is_custom": True,
        }

    def delete_preset(self, category: str, preset_id: str) -> bool:
        """Delete a custom preset. Bundled presets cannot be deleted."""
        clean_id = preset_id[:-5] if preset_id.endswith(".yaml") else preset_id
        cat = self.get_category_by_id(category)
        folder_name = cat.get("folder", cat.get("id", category)) if cat else category

        user_yaml = self.user_presets_dir / folder_name / f"{clean_id}.yaml"
        if not user_yaml.exists():
            # Check if it was in any other folder in user_presets_dir
            for f in self.user_presets_dir.iterdir():
                if f.is_dir():
                    candidate = f / f"{clean_id}.yaml"
                    if candidate.exists():
                        user_yaml = candidate
                        break

        if not user_yaml.exists():
            # Check if it's a bundled preset
            bundled = self.get_preset(category, clean_id)
            if bundled and not bundled.get("is_custom"):
                raise PermissionError("Bundled presets are read-only and cannot be deleted.")
            return False

        user_yaml.unlink(missing_ok=True)
        for ext in (".webp", ".png", ".jpg", ".jpeg"):
            thumb = user_yaml.parent / f"{clean_id}{ext}"
            thumb.unlink(missing_ok=True)

        return True

    def export_pack(self, category: Optional[str] = None, include_bundled: bool = False) -> bytes:
        """Export presets pack into an in-memory zip file."""
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            source_filter = "all" if include_bundled else "user"
            presets = self.list_presets(category=category, limit=10000, source=source_filter)["items"]

            manifest = {
                "version": "1.0.0",
                "exported_at": time.time(),
                "preset_count": len(presets),
                "presets": [
                    {
                        "id": p["id"],
                        "name": p["name"],
                        "category": p["category"],
                        "folder": p["folder"],
                    }
                    for p in presets
                ],
            }
            zf.writestr("manifest.json", json.dumps(manifest, indent=2))

            for p in presets:
                folder = p.get("folder", p.get("category", "general"))
                pid = p["id"]

                # Find source yaml
                raw_data = self.get_preset(p["category"], pid)
                if raw_data:
                    clean_dict = {
                        "name": raw_data.get("name", pid),
                        "keywords": raw_data.get("keywords", ""),
                        "negative": raw_data.get("negative", ""),
                        "weight": raw_data.get("weight", 1.0),
                        "description": raw_data.get("description", ""),
                        "labels": raw_data.get("labels", []),
                    }
                    zf.writestr(f"{folder}/{pid}.yaml", yaml.safe_dump(clean_dict, allow_unicode=True))

                thumb = self.get_thumbnail_path(p["category"], pid)
                if thumb and thumb.exists():
                    zf.writestr(f"{folder}/{pid}{thumb.suffix}", thumb.read_bytes())

        return buf.getvalue()

    def import_pack(self, zip_bytes: bytes) -> Dict[str, Any]:
        """Safely import presets and thumbnails from a zip pack or single YAML/JSON preset file into user_presets."""
        # Check if single YAML or JSON file
        if not zip_bytes.startswith(b"PK"):
            try:
                text = zip_bytes.decode("utf-8")
                parsed = yaml.safe_load(text)
                if isinstance(parsed, dict) and ("keywords" in parsed or "name" in parsed):
                    name = str(parsed.get("name", "Imported Preset"))
                    cat = str(parsed.get("category", "characters"))
                    saved = self.save_preset(
                        category=cat,
                        name=name,
                        keywords=str(parsed.get("keywords", "")),
                        negative=str(parsed.get("negative", "")),
                        weight=float(parsed.get("weight", 1.0)),
                        description=str(parsed.get("description", "")),
                    )
                    return {"imported_presets": 1, "categories": [saved["folder"]]}
            except Exception:
                pass

        if len(zip_bytes) > MAX_PACK_BYTES:
            raise ValueError("Preset pack is too large")

        buf = io.BytesIO(zip_bytes)
        imported_count = 0
        categories_updated = set()

        with zipfile.ZipFile(buf, "r") as zf:
            for member in zf.infolist():
                if member.is_dir():
                    continue

                filename = Path(member.filename)
                # Prevent directory traversal attacks
                if ".." in member.filename or member.filename.startswith(("/", "\\")):
                    continue

                parts = filename.parts
                if len(parts) == 1 and parts[0] == "manifest.json":
                    continue

                if member.file_size > MAX_MEMBER_BYTES:
                    continue

                if len(parts) >= 2:
                    folder_name = parts[0]
                    if not SAFE_FOLDER_RE.match(folder_name):
                        continue
                    target_dir = self.user_presets_dir / folder_name
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_file = target_dir / filename.name

                    if filename.suffix in (".yaml", ".yml"):
                        content = zf.read(member)
                        # Validate it parses as yaml
                        try:
                            parsed = yaml.safe_load(content.decode("utf-8"))
                            if isinstance(parsed, dict):
                                target_file.write_bytes(content)
                                imported_count += 1
                                categories_updated.add(folder_name)
                        except Exception:
                            pass
                    elif filename.suffix in (".webp", ".png", ".jpg", ".jpeg"):
                        content = zf.read(member)
                        target_file.write_bytes(content)

        return {
            "imported_presets": imported_count,
            "categories": list(categories_updated),
        }
