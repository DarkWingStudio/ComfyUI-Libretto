"""Unit tests for Libretto native ComfyUI prompt and asset nodes."""

import json
import os
import sys
import unittest

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from nodes.asset_nodes import (
    LibrettoCharacterNode,
    LibrettoOutfitNode,
    LibrettoHairNode,
    LibrettoPoseNode,
    LibrettoEnvironmentNode,
    LibrettoLightingNode,
    LibrettoStyleNode,
)
# pyrefly: ignore[missing-import]
from nodes.profile_nodes import (
    LibrettoSDXLProfileNode,
    LibrettoPonyProfileNode,
    LibrettoFluxProfileNode,
)
# pyrefly: ignore[missing-import]
from nodes.prompt_nodes import (
    LibrettoPromptBuilderNode,
    LibrettoPromptMergeNode,
    LibrettoPromptWeightNode,
)
# pyrefly: ignore[missing-import]
from nodes.collection_nodes import (
    LibrettoCollectionNode,
    LibrettoCategoryCollectionNode,
)
# pyrefly: ignore[missing-import]
from nodes.utility_nodes import LibrettoCollectionSeedNode, LibrettoPromptPreviewNode


class TestPromptNodes(unittest.TestCase):
    def test_character_and_outfit_nodes(self):
        char_node = LibrettoCharacterNode()
        (char_asset,) = char_node.create_asset(
            name="Seraphina",
            keywords="1girl, solo, silver hair, angelic wings",
            lora_name="seraphina_v1.safetensors",
            lora_strength=0.9,
        )
        self.assertEqual(char_asset.name, "Seraphina")
        self.assertEqual(char_asset.category, "character")
        self.assertIsNotNone(char_asset.lora)

        outfit_node = LibrettoOutfitNode()
        (outfit_asset,) = outfit_node.create_asset(
            name="Battle Armor",
            keywords="white gold ornate armor",
            character_id="seraphina",
            weight=1.1,
        )
        self.assertEqual(outfit_asset.category, "costume")
        self.assertEqual(outfit_asset.character_id, "seraphina")

    def test_prompt_builder_node_execution(self):
        # 1. Profile node
        profile_node = LibrettoSDXLProfileNode()
        (sdxl_prof,) = profile_node.get_profile()

        # 2. Asset nodes
        char_node = LibrettoCharacterNode()
        (char_asset,) = char_node.create_asset(name="Hero", keywords="1boy, warrior")

        env_node = LibrettoEnvironmentNode()
        (env_asset,) = env_node.create_asset(keywords="ancient ruins, floating islands")

        # 3. Builder node
        builder = LibrettoPromptBuilderNode()
        pos, neg, snapshot_json = builder.build_prompt(
            profile=sdxl_prof,
            asset_1=char_asset,
            asset_2=env_asset,
            extra_positive="cinematic shot",
            extra_negative="watermark",
        )

        self.assertIsInstance(pos, str)
        self.assertIsInstance(neg, str)
        self.assertTrue(pos.startswith("masterpiece, best quality"))
        self.assertIn("1boy", pos)
        self.assertIn("ancient ruins", pos)
        self.assertIn("watermark", neg)

        snapshot = json.loads(snapshot_json)
        self.assertEqual(snapshot["profile_id"], "sdxl")
        self.assertEqual(len(snapshot["components"]), 2)

    def test_collection_node_selection(self):
        c_node = LibrettoCharacterNode()
        (c1,) = c_node.create_asset(name="Alpha", keywords="alpha")
        (c2,) = c_node.create_asset(name="Beta", keywords="beta")

        coll_node = LibrettoCollectionNode()
        (selected, name) = coll_node.select_asset(
            mode="fixed",
            collection_seed=42,
            fixed_index=1,
            asset_1=c1,
            asset_2=c2,
        )
        self.assertEqual(name, "Beta")
        self.assertEqual(selected.keywords, "beta")

    def test_category_collection_node(self):
        cat_coll = LibrettoCategoryCollectionNode()
        # Test random selection from bundled costumes
        (asset, name, kw, neg) = cat_coll.select_from_category(
            category="costumes",
            mode="fixed",
            collection_seed=123,
            fixed_index=0,
        )
        self.assertIsNotNone(asset)
        self.assertTrue(len(name) > 0)
        self.assertTrue(len(kw) > 0)

        # Test filter query
        (f_asset, f_name, f_kw, f_neg) = cat_coll.select_from_category(
            category="hairstyles",
            filter_query="twintails",
            mode="random",
            collection_seed=42,
        )
        self.assertIn("twintails", f_kw.lower())

    def test_utility_nodes(self):
        seed_node = LibrettoCollectionSeedNode()
        (s1,) = seed_node.get_seed(seed=1234, control="fixed")
        self.assertEqual(s1, 1234)

        preview_node = LibrettoPromptPreviewNode()
        res = preview_node.preview("sample text")
        self.assertEqual(res["result"], ("sample text",))


if __name__ == "__main__":
    unittest.main()

