"""Unit tests for Libretto Prompt Compiler."""

import os
import sys
import unittest

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.compiler import CompiledPrompt, PromptCompiler, PromptComponent
# pyrefly: ignore[missing-import]
from libretto.profiles import BUILTIN_PROFILES, ModelProfile


class TestPromptCompiler(unittest.TestCase):
    def setUp(self):
        self.sdxl_profile = BUILTIN_PROFILES["sdxl"]
        self.pony_profile = BUILTIN_PROFILES["pony"]
        self.flux_profile = BUILTIN_PROFILES["flux"]

    def test_sdxl_tag_formatting_and_deduplication(self):
        compiler = PromptCompiler(self.sdxl_profile)
        components = [
            PromptComponent(category="character", keywords="1girl, solo, silver hair"),
            PromptComponent(category="hair", keywords="silver hair, long twin braids"),  # "silver hair" duplicate
            PromptComponent(category="costume", keywords="cyberpunk jacket, neon accents", weight=1.2),
            PromptComponent(category="environment", keywords="rainy tokyo alley, neon reflections"),
        ]
        result = compiler.compile(components, extra_positive="masterpiece, cinematic")

        # Must have positive prefix from SDXL
        self.assertTrue(result.positive.startswith("masterpiece, best quality"))
        # Must deduplicate "silver hair" and "masterpiece"
        tags = [t.strip() for t in result.positive.split(",")]
        silver_count = sum(1 for t in tags if "silver hair" in t.lower())
        self.assertEqual(silver_count, 1)

        # Check weight formatting
        self.assertIn("(cyberpunk jacket:1.20)", result.positive)
        self.assertIn("(neon accents:1.20)", result.positive)

        # Check negative prompt has SDXL prefix
        self.assertTrue(result.negative.startswith("lowres, bad anatomy"))

    def test_pony_quality_scores(self):
        compiler = PromptCompiler(self.pony_profile)
        components = [
            PromptComponent(category="character", keywords="1girl, hatsune miku"),
            PromptComponent(category="pose", keywords="peace sign, standing"),
        ]
        result = compiler.compile(components)
        self.assertTrue(result.positive.startswith("score_9, score_8_up, score_7_up"))
        self.assertTrue(result.negative.startswith("score_6, score_5, score_4"))
        self.assertIn("hatsune miku", result.positive)

    def test_flux_natural_language_formatting(self):
        compiler = PromptCompiler(self.flux_profile)
        components = [
            PromptComponent(
                category="character",
                description="A futuristic cybernetic woman with glowing cyan eyes",
            ),
            PromptComponent(
                category="costume",
                description="She wears a sleek carbon-fiber armor with glowing circuits",
            ),
            PromptComponent(
                category="environment",
                description="Standing atop a misty skyscraper overlooking Neo-Kyoto at dusk",
            ),
        ]
        result = compiler.compile(components)
        # Flux uses natural language sentences joined with ". "
        self.assertIn("A futuristic cybernetic woman with glowing cyan eyes.", result.positive)
        self.assertIn("She wears a sleek carbon-fiber armor with glowing circuits.", result.positive)
        self.assertIn("Standing atop a misty skyscraper overlooking Neo-Kyoto at dusk.", result.positive)
        # Flux has supports_negative=False by default
        self.assertEqual(result.negative, "")

    def test_character_grouping(self):
        compiler = PromptCompiler(self.sdxl_profile)
        # Mix up categories: environment, costume for Alice, character Bob, character Alice
        components = [
            PromptComponent(category="environment", keywords="dense forest"),
            PromptComponent(category="costume", keywords="red cloak", character_id="alice"),
            PromptComponent(category="character", id="bob", name="Bob", keywords="1boy, bob"),
            PromptComponent(category="character", id="alice", name="Alice", keywords="1girl, alice"),
            PromptComponent(category="hair", keywords="blonde braids", character_id="alice"),
        ]
        result = compiler.compile(components)
        # In result positive, Alice and her attributes should come together before Bob or environment
        alice_idx = result.positive.find("1girl")
        blonde_idx = result.positive.find("blonde braids")
        red_cloak_idx = result.positive.find("red cloak")
        bob_idx = result.positive.find("1boy")
        forest_idx = result.positive.find("dense forest")

        self.assertTrue(alice_idx < blonde_idx < red_cloak_idx)
        self.assertTrue(red_cloak_idx < forest_idx)

    def test_lora_collection(self):
        compiler = PromptCompiler(self.sdxl_profile)
        components = [
            PromptComponent(
                category="character",
                keywords="elena",
                lora={"name": "elena_sdxl.safetensors", "strength": 0.8},
            ),
            PromptComponent(
                category="style",
                keywords="ghibli style",
                lora={"name": "studio_ghibli_v1.safetensors", "strength": 0.6},
            ),
        ]
        result = compiler.compile(components)
        self.assertEqual(len(result.loras), 2)
        names = [l["name"] for l in result.loras]
        self.assertIn("elena_sdxl.safetensors", names)
        self.assertIn("studio_ghibli_v1.safetensors", names)


if __name__ == "__main__":
    unittest.main()

