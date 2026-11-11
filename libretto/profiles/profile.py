"""Model Profile specification and built-in profiles for ComfyUI-Libretto."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
import re
from typing import Any, Dict, List, Optional


DEFAULT_CATEGORY_ORDER: List[str] = [
    "style",
    "character",
    "hair",
    "costume",
    "pose",
    "emotion",
    "props",
    "situation",
    "location",
    "lighting",
    "view",
    "custom",
]

HAIR_COLORS: List[str] = [
    "black",
    "dark brown",
    "brown",
    "light brown",
    "auburn",
    "red",
    "ginger",
    "orange",
    "blonde",
    "platinum blonde",
    "white",
    "silver",
    "gray",
    "pink",
    "purple",
    "blue",
    "light blue",
    "green",
]


def apply_hair_color(text: str, color: Optional[str]) -> str:
    """Fill a {color} placeholder, or prepend '<color> hair' when the text has none."""
    clean_color = (color or "").strip()
    if "{color}" in text:
        text = text.replace("{color}", clean_color) if clean_color else re.sub(r"\{color\}\s*", "", text)
        return re.sub(r"\s{2,}", " ", text).strip()
    return f"{clean_color} hair, {text}" if clean_color and text else (f"{clean_color} hair" if clean_color else text)


@dataclass
class ModelProfile:
    """Configuration for formatting prompts tailored to a specific model architecture."""
    id: str
    name: str
    target_model: str = "generic"  # "sdxl", "pony", "flux", "generic"
    format_style: str = "tags"     # "tags" or "natural_language"
    separator: str = ", "
    positive_prefix: str = ""
    positive_suffix: str = ""
    negative_prefix: str = ""
    negative_suffix: str = ""
    weight_template: str = "({text}:{weight:.2f})"
    supports_negative: bool = True
    category_order: List[str] = field(default_factory=lambda: list(DEFAULT_CATEGORY_ORDER))
    strip_duplicate_tags: bool = True
    natural_templates: Dict[str, str] = field(default_factory=dict)
    group_sep: str = "comma"  # "comma" or "break"
    defaults: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> ModelProfile:
        return cls(
            id=str(data.get("id", "custom")),
            name=str(data.get("name", "Custom Profile")),
            target_model=str(data.get("target_model", "generic")),
            format_style=str(data.get("format_style", data.get("format", "tags"))),
            separator=str(data.get("separator", ", ")),
            positive_prefix=str(data.get("positive_prefix", data.get("quality_prefix", ""))),
            positive_suffix=str(data.get("positive_suffix", "")),
            negative_prefix=str(data.get("negative_prefix", data.get("negative_template", ""))),
            negative_suffix=str(data.get("negative_suffix", "")),
            weight_template=str(data.get("weight_template", "({text}:{weight:.2f})")),
            supports_negative=bool(data.get("supports_negative", data.get("use_negative", True))),
            category_order=list(data.get("category_order", data.get("order", DEFAULT_CATEGORY_ORDER))),
            strip_duplicate_tags=bool(data.get("strip_duplicate_tags", True)),
            natural_templates=dict(data.get("natural_templates", data.get("natural", {}))),
            group_sep=str(data.get("group_sep", "comma")),
            defaults=dict(data.get("defaults", {})),
        )


# Built-in model profiles based on Libretto profiles
BUILTIN_PROFILES: Dict[str, ModelProfile] = {
    "sdxl": ModelProfile(
        id="sdxl",
        name="SDXL Standard",
        target_model="sdxl",
        format_style="tags",
        separator=", ",
        positive_prefix="masterpiece, best quality",
        positive_suffix="",
        negative_prefix="lowres, bad anatomy, bad hands, text, watermark, worst quality",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "sd_xl_base_1.0.safetensors",
            "width": 1024,
            "height": 1024,
            "steps": 28,
            "cfg": 6.5,
            "sampler": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 1.0,
        },
    ),
    "pony": ModelProfile(
        id="pony",
        name="Pony Diffusion V6",
        target_model="pony",
        format_style="tags",
        separator=", ",
        positive_prefix="score_9, score_8_up, score_7_up",
        positive_suffix="",
        negative_prefix="score_6, score_5, score_4, lowres, bad anatomy, text, watermark",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "ponyDiffusionV6XL.safetensors",
            "width": 832,
            "height": 1216,
            "steps": 28,
            "cfg": 6.5,
            "sampler": "euler_ancestral",
            "scheduler": "normal",
            "denoise": 1.0,
        },
    ),
    "flux": ModelProfile(
        id="flux",
        name="Flux.1 (Dev / Schnell)",
        target_model="flux",
        format_style="natural_language",
        separator=". ",
        positive_prefix="",
        positive_suffix="",
        negative_prefix="",
        negative_suffix="",
        weight_template="{text}",
        supports_negative=False,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        natural_templates={
            "style": "A {text} image",
            "character": "{text}",
            "hair": "She has {text}",
            "costume": "She is wearing {text}",
            "pose": "{text}",
            "emotion": "Her expression is {text}",
            "props": "{text}",
            "situation": "{text}",
            "location": "The scene takes place in {text}",
            "lighting": "The lighting is {text}",
            "view": "Shot as {text}",
        },
        defaults={
            "checkpoint": "flux1-dev-fp8.safetensors",
            "width": 1024,
            "height": 1024,
            "steps": 20,
            "cfg": 1.0,
            "sampler": "euler",
            "scheduler": "simple",
            "denoise": 1.0,
        },
    ),
    "sd15": ModelProfile(
        id="sd15",
        name="Stable Diffusion 1.5",
        target_model="sd15",
        format_style="tags",
        separator=", ",
        positive_prefix="masterpiece, best quality, ultra-detailed",
        positive_suffix="",
        negative_prefix="worst quality, low quality, normal quality, lowres, blurry, bad anatomy, bad hands, missing fingers, extra digits",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "v1-5-pruned-emaonly.safetensors",
            "width": 512,
            "height": 768,
            "steps": 25,
            "cfg": 7.0,
            "sampler": "dpmpp_2m_sde",
            "scheduler": "karras",
            "denoise": 1.0,
        },
    ),
    "animagine": ModelProfile(
        id="animagine",
        name="Animagine XL / NoobAI",
        target_model="animagine",
        format_style="tags",
        separator=", ",
        positive_prefix="masterpiece, best quality, very aesthetic, newest, absurdres",
        positive_suffix="",
        negative_prefix="lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "animagine-xl-3.1.safetensors",
            "width": 832,
            "height": 1216,
            "steps": 28,
            "cfg": 6.5,
            "sampler": "euler_ancestral",
            "scheduler": "karras",
            "denoise": 1.0,
        },
    ),
    "illustrious": ModelProfile(
        id="illustrious",
        name="Illustrious XL",
        target_model="illustrious",
        format_style="tags",
        separator=", ",
        positive_prefix="masterpiece, best quality, amazing quality, very aesthetic, absurdres",
        positive_suffix="",
        negative_prefix="bad quality, worst quality, bad anatomy, bad hands, lowres, text, watermark",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "illustriousXL_v01.safetensors",
            "width": 896,
            "height": 1152,
            "steps": 25,
            "cfg": 6.0,
            "sampler": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
        },
    ),
    "photoreal": ModelProfile(
        id="photoreal",
        name="Photorealistic / Cinematic",
        target_model="photoreal",
        format_style="natural_language",
        separator=", ",
        positive_prefix="cinematic film still, 35mm photograph, shot on Kodak Portra 400, f/1.8, realistic texture, natural lighting",
        positive_suffix="detailed skin pores, 8k resolution, masterwork",
        negative_prefix="cgi, 3d render, anime, illustration, cartoon, fake, drawing, painting, bad eyes, plastic skin",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
        defaults={
            "checkpoint": "realisticVisionV60B1_v60B1VAE.safetensors",
            "width": 1024,
            "height": 1024,
            "steps": 30,
            "cfg": 5.5,
            "sampler": "dpmpp_2m_sde",
            "scheduler": "karras",
            "denoise": 1.0,
        },
    ),
    "generic": ModelProfile(
        id="generic",
        name="Generic / Standard",
        target_model="generic",
        format_style="tags",
        separator=", ",
        positive_prefix="",
        positive_suffix="",
        negative_prefix="",
        negative_suffix="",
        weight_template="({text}:{weight:.2f})",
        supports_negative=True,
        category_order=list(DEFAULT_CATEGORY_ORDER),
    ),
}
