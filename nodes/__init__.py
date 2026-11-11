"""Node exports for ComfyUI-Libretto."""

# pyrefly: ignore[missing-import]
from .libretto_input import LibrettoInput
# pyrefly: ignore[missing-import]
from .libretto_output import LibrettoOutput
# pyrefly: ignore[missing-import]
from .metadata import LibrettoMetadata

# Asset nodes
# pyrefly: ignore[missing-import]
from .asset_nodes import (
    LibrettoCharacterNode,
    LibrettoOutfitNode,
    LibrettoHairNode,
    LibrettoPoseNode,
    LibrettoExpressionNode,
    LibrettoEnvironmentNode,
    LibrettoLightingNode,
    LibrettoCameraNode,
    LibrettoStyleNode,
    LibrettoCustomPromptNode,
)

# Profile nodes
# pyrefly: ignore[missing-import]
from .profile_nodes import (
    LibrettoSDXLProfileNode,
    LibrettoPonyProfileNode,
    LibrettoFluxProfileNode,
    LibrettoSD15ProfileNode,
    LibrettoAnimagineProfileNode,
    LibrettoIllustriousProfileNode,
    LibrettoPhotorealProfileNode,
    LibrettoCustomProfileNode,
)

# Prompt compilation nodes
# pyrefly: ignore[missing-import]
from .prompt_nodes import (
    LibrettoPromptBuilderNode,
    LibrettoPromptMergeNode,
    LibrettoPromptWeightNode,
)

# Collection nodes
# pyrefly: ignore[missing-import]
from .collection_nodes import (
    LibrettoCollectionNode,
    LibrettoCategoryCollectionNode,
)

# Utility nodes
# pyrefly: ignore[missing-import]
from .utility_nodes import (
    LibrettoCollectionSeedNode,
    LibrettoPromptPreviewNode,
)

NODE_CLASS_MAPPINGS = {
    # Original interface / workflow nodes
    "LibrettoInput": LibrettoInput,
    "LibrettoOutput": LibrettoOutput,
    "LibrettoMetadata": LibrettoMetadata,

    # Asset nodes
    "LibrettoCharacter": LibrettoCharacterNode,
    "LibrettoOutfit": LibrettoOutfitNode,
    "LibrettoHair": LibrettoHairNode,
    "LibrettoPose": LibrettoPoseNode,
    "LibrettoExpression": LibrettoExpressionNode,
    "LibrettoEnvironment": LibrettoEnvironmentNode,
    "LibrettoLighting": LibrettoLightingNode,
    "LibrettoCamera": LibrettoCameraNode,
    "LibrettoStyle": LibrettoStyleNode,
    "LibrettoCustomPrompt": LibrettoCustomPromptNode,

    # Profile nodes
    "LibrettoSDXLProfile": LibrettoSDXLProfileNode,
    "LibrettoPonyProfile": LibrettoPonyProfileNode,
    "LibrettoFluxProfile": LibrettoFluxProfileNode,
    "LibrettoSD15Profile": LibrettoSD15ProfileNode,
    "LibrettoAnimagineProfile": LibrettoAnimagineProfileNode,
    "LibrettoIllustriousProfile": LibrettoIllustriousProfileNode,
    "LibrettoPhotorealProfile": LibrettoPhotorealProfileNode,
    "LibrettoCustomProfile": LibrettoCustomProfileNode,

    # Prompt builder & transform nodes
    "LibrettoPromptBuilder": LibrettoPromptBuilderNode,
    "LibrettoPromptMerge": LibrettoPromptMergeNode,
    "LibrettoPromptWeight": LibrettoPromptWeightNode,

    # Collection nodes
    "LibrettoCollection": LibrettoCollectionNode,
    "LibrettoCategoryCollection": LibrettoCategoryCollectionNode,

    # Utility nodes
    "LibrettoCollectionSeed": LibrettoCollectionSeedNode,
    "LibrettoPromptPreview": LibrettoPromptPreviewNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LibrettoInput": "Libretto Input",
    "LibrettoOutput": "Libretto Output",
    "LibrettoMetadata": "Libretto Metadata",

    # Asset nodes
    "LibrettoCharacter": "Libretto Character",
    "LibrettoOutfit": "Libretto Outfit",
    "LibrettoHair": "Libretto Hair",
    "LibrettoPose": "Libretto Pose",
    "LibrettoExpression": "Libretto Expression",
    "LibrettoEnvironment": "Libretto Environment",
    "LibrettoLighting": "Libretto Lighting",
    "LibrettoCamera": "Libretto Camera",
    "LibrettoStyle": "Libretto Art Style",
    "LibrettoCustomPrompt": "Libretto Custom Prompt",

    # Profile nodes
    "LibrettoSDXLProfile": "Libretto SDXL Profile",
    "LibrettoPonyProfile": "Libretto Pony Profile",
    "LibrettoFluxProfile": "Libretto Flux Profile",
    "LibrettoSD15Profile": "Libretto SD 1.5 Profile",
    "LibrettoAnimagineProfile": "Libretto Animagine XL Profile",
    "LibrettoIllustriousProfile": "Libretto Illustrious XL Profile",
    "LibrettoPhotorealProfile": "Libretto Photoreal Profile",
    "LibrettoCustomProfile": "Libretto Custom Profile",

    # Prompt nodes
    "LibrettoPromptBuilder": "Libretto Prompt Builder",
    "LibrettoPromptMerge": "Libretto Prompt Merge",
    "LibrettoPromptWeight": "Libretto Prompt Weight",

    # Collection nodes
    "LibrettoCollection": "Libretto Collection",
    "LibrettoCategoryCollection": "Libretto Category Collection",

    # Utility nodes
    "LibrettoCollectionSeed": "Libretto Collection Seed",
    "LibrettoPromptPreview": "Libretto Prompt Preview",
}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]
