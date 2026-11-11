"""ComfyUI-Libretto custom node package entrypoint."""

from __future__ import annotations

import logging
import os
import sys

# Ensure this directory is importable
package_root = os.path.dirname(os.path.abspath(__file__))
if package_root not in sys.path:
    sys.path.insert(0, package_root)

from .nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
from libretto.repository import LibraryRepository
from libretto.api import register_api_routes

logger = logging.getLogger("ComfyUI-Libretto")

# Configure persistent storage root
# Priority: LIBRETTO_DATA_DIR env var -> comfy user/libretto -> custom_nodes/ComfyUI-Libretto/data
data_dir = os.environ.get("LIBRETTO_DATA_DIR")
if not data_dir:
    data_dir = os.path.join(package_root, "data")

repository = LibraryRepository(data_dir)

# Register API routes with ComfyUI PromptServer
try:
    from server import PromptServer  # type: ignore

    if hasattr(PromptServer, "instance") and PromptServer.instance is not None:
        register_api_routes(PromptServer.instance.app, repository)
        logger.info("ComfyUI-Libretto initialized successfully with storage at: %s", data_dir)
except ImportError:
    logger.debug("PromptServer not available; running outside ComfyUI host process.")
except Exception as e:
    logger.error("Failed to register Libretto API routes with ComfyUI: %s", e)

# Tell ComfyUI where the web frontend extension assets reside
WEB_DIRECTORY = "./web/dist"

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    "WEB_DIRECTORY",
    "repository",
]
