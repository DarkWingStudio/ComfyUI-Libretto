"""Prompt compiler for ComfyUI-Libretto.

Translates structured creative assets and components into model-optimized positive
and negative prompt strings based on target ModelProfile specifications.
"""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional, Set

# pyrefly: ignore[missing-import]
from ..profiles.profile import ModelProfile, apply_hair_color
# pyrefly: ignore[missing-import]
from .components import CompiledPrompt, PromptComponent


class PromptCompiler:
    """Compiles structured PromptComponents into formatted prompt strings."""

    def __init__(self, profile: ModelProfile) -> None:
        self.profile = profile

    def compile(
        self,
        components: List[PromptComponent],
        extra_positive: str = "",
        extra_negative: str = "",
        seed: Optional[int] = None,
    ) -> CompiledPrompt:
        """Compile a list of components into positive and negative prompts."""
        # 1. Sort components according to profile category order and character grouping
        sorted_components = self._order_components(components)

        # 2. Compile positive prompt
        positive_prompt = self._compile_positive(sorted_components, extra_positive)

        # 3. Compile negative prompt
        negative_prompt = self._compile_negative(sorted_components, extra_negative)

        # 4. Collect LoRAs
        loras = self._collect_loras(sorted_components)

        # 5. Build generation snapshot
        snapshot = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "profile_id": self.profile.id,
            "target_model": self.profile.target_model,
            "format_style": self.profile.format_style,
            "seed": seed,
            "components": [
                {
                    "id": c.id,
                    "name": c.name,
                    "category": c.category,
                    "weight": c.weight,
                    "character_id": c.character_id,
                }
                for c in sorted_components
            ],
            "loras": loras,
        }

        return CompiledPrompt(
            positive=positive_prompt,
            negative=negative_prompt,
            profile_id=self.profile.id,
            format_style=self.profile.format_style,
            components_used=[c.to_dict() for c in sorted_components],
            loras=loras,
            generation_snapshot=snapshot,
        )

    def _get_category_rank(self, category: str) -> int:
        cat_lower = category.lower().strip()
        for idx, cat_name in enumerate(self.profile.category_order):
            if cat_lower == cat_name.lower():
                return idx
        return len(self.profile.category_order) + 10

    def _order_components(self, components: List[PromptComponent]) -> List[PromptComponent]:
        """Order components by category hierarchy, grouping character attributes under their character."""
        # First group by character_id if present
        characters: Dict[str, List[PromptComponent]] = {}
        ungrouped: List[PromptComponent] = []

        for c in components:
            if c.character_id:
                characters.setdefault(c.character_id, []).append(c)
            elif c.category == "character":
                char_key = c.id if c.id else c.name
                characters.setdefault(char_key, []).append(c)
            else:
                ungrouped.append(c)

        ordered: List[PromptComponent] = []

        # Sort character bundles internally by category rank
        for char_key, char_components in characters.items():
            char_components.sort(key=lambda item: self._get_category_rank(item.category))
            ordered.extend(char_components)

        # Sort remaining components by category rank
        ungrouped.sort(key=lambda item: self._get_category_rank(item.category))
        ordered.extend(ungrouped)

        return ordered

    def _compile_positive(self, components: List[PromptComponent], extra_positive: str) -> str:
        if self.profile.format_style == "natural_language":
            return self._compile_natural_language(components, extra_positive)
        return self._compile_tags(components, extra_positive)

    def _compile_tags(self, components: List[PromptComponent], extra_positive: str) -> str:
        seen_tags: Set[str] = set()
        tag_list: List[str] = []

        def add_tag(tag: str, weight: float = 1.0) -> None:
            clean_tag = tag.strip()
            if not clean_tag:
                return
            normalized = clean_tag.lower()
            if self.profile.strip_duplicate_tags and normalized in seen_tags:
                return
            seen_tags.add(normalized)

            if abs(weight - 1.0) > 0.001 and "{weight" in self.profile.weight_template:
                formatted_tag = self.profile.weight_template.format(text=clean_tag, weight=weight)
            else:
                formatted_tag = clean_tag
            tag_list.append(formatted_tag)

        # 1. Prefix tags
        if self.profile.positive_prefix:
            for p_tag in self.profile.positive_prefix.split(","):
                add_tag(p_tag, 1.0)

        # 2. Component tags
        for comp in components:
            raw_text = comp.keywords if comp.keywords.strip() else comp.description
            if not raw_text:
                continue

            if comp.category == "hair" or comp.hair_color:
                raw_text = apply_hair_color(raw_text, comp.hair_color)

            # Split raw text into individual tags
            chunks = [c.strip() for c in raw_text.split(",") if c.strip()]
            for chunk in chunks:
                add_tag(chunk, comp.weight)

        # 3. Extra positive
        if extra_positive:
            for chunk in extra_positive.split(","):
                add_tag(chunk, 1.0)

        # 4. Suffix tags
        if self.profile.positive_suffix:
            for s_tag in self.profile.positive_suffix.split(","):
                add_tag(s_tag, 1.0)

        return self.profile.separator.join(tag_list)

    def _compile_natural_language(self, components: List[PromptComponent], extra_positive: str) -> str:
        clauses: List[str] = []

        if self.profile.positive_prefix:
            clauses.append(self.profile.positive_prefix.strip())

        for comp in components:
            raw = comp.description if comp.description.strip() else comp.keywords
            clean = raw.strip()
            if not clean:
                continue

            if comp.category == "hair" or comp.hair_color:
                clean = apply_hair_color(clean, comp.hair_color)

            # Ensure sentence ending without trailing punctuation
            if clean.endswith(".") or clean.endswith(","):
                clean = clean[:-1].strip()

            # Apply natural language template if available for this category
            template = self.profile.natural_templates.get(comp.category, "{text}")
            formatted = template.format(text=clean)
            clauses.append(formatted)

        if extra_positive:
            clean_extra = extra_positive.strip()
            if clean_extra.endswith(".") or clean_extra.endswith(","):
                clean_extra = clean_extra[:-1].strip()
            clauses.append(clean_extra)

        if self.profile.positive_suffix:
            clauses.append(self.profile.positive_suffix.strip())

        if not clauses:
            return ""

        # Join sentences with proper punctuation
        result = self.profile.separator.join(clauses)
        if self.profile.separator == ". " and not result.endswith("."):
            result += "."
        return result

    def _compile_negative(self, components: List[PromptComponent], extra_negative: str) -> str:
        if not self.profile.supports_negative and not extra_negative.strip():
            return ""

        seen_tags: Set[str] = set()
        tag_list: List[str] = []

        def add_tag(tag: str) -> None:
            clean_tag = tag.strip()
            if not clean_tag:
                return
            normalized = clean_tag.lower()
            if self.profile.strip_duplicate_tags and normalized in seen_tags:
                return
            seen_tags.add(normalized)
            tag_list.append(clean_tag)

        # Prefix negative
        if self.profile.negative_prefix:
            for n_tag in self.profile.negative_prefix.split(","):
                add_tag(n_tag)

        # Component negatives
        for comp in components:
            if comp.negative:
                for chunk in comp.negative.split(","):
                    add_tag(chunk)

        # Extra negative
        if extra_negative:
            for chunk in extra_negative.split(","):
                add_tag(chunk)

        # Suffix negative
        if self.profile.negative_suffix:
            for s_tag in self.profile.negative_suffix.split(","):
                add_tag(s_tag)

        return self.profile.separator.join(tag_list)

    def _collect_loras(self, components: List[PromptComponent]) -> List[Dict[str, Any]]:
        lora_dict: Dict[str, Dict[str, Any]] = {}
        for comp in components:
            if comp.lora and isinstance(comp.lora, dict):
                name = comp.lora.get("name")
                if name:
                    strength = float(comp.lora.get("strength", 1.0))
                    if name in lora_dict:
                        # Take highest strength or average
                        strength = max(strength, float(lora_dict[name].get("strength", 1.0)))
                    lora_dict[name] = {"name": name, "strength": strength}
        return list(lora_dict.values())

