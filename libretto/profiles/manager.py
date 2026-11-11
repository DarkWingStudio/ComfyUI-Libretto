"""Profile manager for ComfyUI-Libretto."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Optional
import yaml

from .profile import BUILTIN_PROFILES, ModelProfile


class ProfileManager:
    """Manages loading, saving, and querying model profiles."""

    def __init__(self, profiles_dir: Optional[Path] = None) -> None:
        self.profiles_dir = profiles_dir
        self._profiles: Dict[str, ModelProfile] = dict(BUILTIN_PROFILES)
        if self.profiles_dir and self.profiles_dir.exists():
            self.load_custom_profiles()

    def load_custom_profiles(self) -> None:
        """Load user-defined profiles from the profiles directory."""
        if not self.profiles_dir or not self.profiles_dir.exists():
            return

        for file_path in self.profiles_dir.iterdir():
            if file_path.suffix.lower() in [".json", ".yaml", ".yml"]:
                try:
                    text = file_path.read_text(encoding="utf-8")
                    if file_path.suffix.lower() == ".json":
                        data = json.loads(text)
                    else:
                        data = yaml.safe_load(text)
                    if isinstance(data, dict) and "id" in data:
                        profile = ModelProfile.from_dict(data)
                        self._profiles[profile.id] = profile
                except Exception:
                    # Ignore invalid files to prevent startup crashes
                    pass

    def get_profile(self, profile_id: str) -> ModelProfile:
        """Get profile by ID, defaulting to generic if not found."""
        return self._profiles.get(profile_id, self._profiles["generic"])

    def list_profiles(self) -> List[ModelProfile]:
        """Return all available profiles."""
        return list(self._profiles.values())

    def register_profile(self, profile: ModelProfile, persist: bool = False) -> None:
        """Register a profile in memory, optionally persisting to disk."""
        self._profiles[profile.id] = profile
        if persist and self.profiles_dir:
            self.profiles_dir.mkdir(parents=True, exist_ok=True)
            target_path = self.profiles_dir / f"{profile.id}.yaml"
            with open(target_path, "w", encoding="utf-8") as f:
                yaml.dump(profile.to_dict(), f, sort_keys=False, allow_unicode=True)

