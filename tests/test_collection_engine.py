"""Unit tests for Libretto Collection Engine."""

import os
import sys
import unittest

_pkg_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)

# pyrefly: ignore[missing-import]
from libretto.collections import CollectionEngine


class TestCollectionEngine(unittest.TestCase):
    def setUp(self):
        self.items = [
            {"id": "c1", "name": "Alice", "weight": 1.0},
            {"id": "c2", "name": "Bob", "weight": 2.0},
            {"id": "c3", "name": "Charlie", "weight": 5.0},
            {"id": "c4", "name": "Diana", "weight": 0.5},
        ]

    def test_random_selection_deterministic_with_seed(self):
        pick1 = CollectionEngine.select_one(self.items, mode="random", seed=42)
        pick2 = CollectionEngine.select_one(self.items, mode="random", seed=42)
        pick3 = CollectionEngine.select_one(self.items, mode="random", seed=999)

        self.assertEqual(pick1, pick2)
        self.assertIsNotNone(pick1)
        self.assertIsNotNone(pick3)

    def test_sequential_selection_modulo(self):
        pick_0 = CollectionEngine.select_one(self.items, mode="sequential", step=0)
        pick_1 = CollectionEngine.select_one(self.items, mode="sequential", step=1)
        pick_4 = CollectionEngine.select_one(self.items, mode="sequential", step=4)  # 4 % 4 = 0

        self.assertEqual(pick_0["id"], "c1")
        self.assertEqual(pick_1["id"], "c2")
        self.assertEqual(pick_4["id"], "c1")

    def test_fixed_selection(self):
        pick_by_id = CollectionEngine.select_one(self.items, mode="fixed", fixed_key_or_index="c3")
        pick_by_name = CollectionEngine.select_one(self.items, mode="fixed", fixed_key_or_index="Diana")
        pick_by_idx = CollectionEngine.select_one(self.items, mode="fixed", fixed_key_or_index=1)

        self.assertEqual(pick_by_id["id"], "c3")
        self.assertEqual(pick_by_name["id"], "c4")
        self.assertEqual(pick_by_idx["id"], "c2")

    def test_weighted_selection_deterministic(self):
        pick1 = CollectionEngine.select_one(self.items, mode="weighted", seed=12345)
        pick2 = CollectionEngine.select_one(self.items, mode="weighted", seed=12345)
        self.assertEqual(pick1, pick2)


if __name__ == "__main__":
    unittest.main()

