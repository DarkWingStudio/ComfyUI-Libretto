"""Validation logic and sanity limits for ComfyUI-Libretto."""

from __future__ import annotations

import re
import uuid
from typing import Any, Dict, List, Optional, Set, Tuple

from .models import (
    CURRENT_SCHEMA_VERSION,
    MAX_PAYLOAD_BYTES,
    MAX_SUMMARY_LENGTH,
    MAX_TAG_LENGTH,
    MAX_TAGS_COUNT,
    MAX_TITLE_LENGTH,
    LibraryEntry,
)

SEMVER_REGEX = re.compile(
    r"^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)"
    r"(?:-(?P<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)"
    r"(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?"
    r"(?:\+(?P<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$"
)

SAFE_ID_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]{1,64}$")


def generate_entry_id() -> str:
    """Generate a clean, sortable, URL-safe UUID."""
    return uuid.uuid4().hex


def sanitize_id(raw_id: str) -> Optional[str]:
    """Ensure ID does not contain path traversal characters or unsafe symbols."""
    raw_id = raw_id.strip()
    if SAFE_ID_REGEX.match(raw_id):
        return raw_id
    return None


def normalize_tags(raw_tags: Any) -> List[str]:
    """Clean, lowercase, deduplicate, and length-limit tags."""
    if not isinstance(raw_tags, list):
        return []
    cleaned: List[str] = []
    seen: Set[str] = set()
    for item in raw_tags:
        if not isinstance(item, str):
            continue
        tag = item.strip().lower()
        if not tag:
            continue
        if len(tag) > MAX_TAG_LENGTH:
            tag = tag[:MAX_TAG_LENGTH]
        if tag not in seen:
            seen.add(tag)
            cleaned.append(tag)
        if len(cleaned) >= MAX_TAGS_COUNT:
            break
    return cleaned


def extract_workflow_requirements_and_interfaces(
    workflow_data: Dict[str, Any],
) -> Tuple[List[str], List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Extract required node classes and Libretto input/output interfaces from workflow JSON.
    Supports both ComfyUI UI format (nodes with type and widgets_values) and API format.
    """
    node_classes: Set[str] = set()
    inputs: List[Dict[str, Any]] = []
    outputs: List[Dict[str, Any]] = []

    # Case 1: Standard ComfyUI UI JSON (contains "nodes" array)
    if "nodes" in workflow_data and isinstance(workflow_data["nodes"], list):
        for node in workflow_data["nodes"]:
            if not isinstance(node, dict):
                continue
            ntype = str(node.get("type", "")).strip()
            if ntype:
                node_classes.add(ntype)

            node_id = node.get("id")
            widgets = node.get("widgets_values") or []

            # Check for LibrettoInput
            if ntype in ("LibrettoInput", "Libretto Input"):
                name = ""
                vtype = "STRING"
                desc = None
                default_val = None
                if len(widgets) > 0 and isinstance(widgets[0], str):
                    name = widgets[0]
                if len(widgets) > 1 and isinstance(widgets[1], str):
                    vtype = widgets[1]
                if len(widgets) > 2:
                    default_val = widgets[2]
                if len(widgets) > 3 and isinstance(widgets[3], str):
                    desc = widgets[3]
                if name:
                    inputs.append({
                        "name": name,
                        "value_type": vtype,
                        "description": desc,
                        "default_value": default_val,
                        "node_id": str(node_id),
                    })

            # Check for LibrettoOutput
            elif ntype in ("LibrettoOutput", "Libretto Output"):
                name = ""
                desc = None
                if len(widgets) > 0 and isinstance(widgets[0], str):
                    name = widgets[0]
                if len(widgets) > 1 and isinstance(widgets[1], str):
                    desc = widgets[1]
                if name:
                    outputs.append({
                        "name": name,
                        "value_type": "ANY",
                        "description": desc,
                        "node_id": str(node_id),
                    })

    # Case 2: ComfyUI Prompt / API JSON (dict where keys are node ids and values have "class_type")
    elif isinstance(workflow_data, dict):
        for nid, node in workflow_data.items():
            if not isinstance(node, dict):
                continue
            ctype = str(node.get("class_type", "")).strip()
            if ctype:
                node_classes.add(ctype)
            inputs_map = node.get("inputs", {})
            if isinstance(inputs_map, dict):
                if ctype in ("LibrettoInput", "Libretto Input"):
                    name = str(inputs_map.get("name", "")).strip()
                    if name:
                        inputs.append({
                            "name": name,
                            "value_type": str(inputs_map.get("value_type", "STRING")),
                            "description": inputs_map.get("description"),
                            "default_value": inputs_map.get("default_value"),
                            "node_id": str(nid),
                        })
                elif ctype in ("LibrettoOutput", "Libretto Output"):
                    name = str(inputs_map.get("name", "")).strip()
                    if name:
                        outputs.append({
                            "name": name,
                            "value_type": "ANY",
                            "description": inputs_map.get("description"),
                            "node_id": str(nid),
                        })

    return sorted(list(node_classes)), inputs, outputs


def validate_entry_payload(
    payload: Dict[str, Any], is_update: bool = False
) -> Tuple[bool, List[str], List[str], Dict[str, Any]]:
    """
    Validate incoming entry data according to PRD rules.
    Returns: (is_valid, error_messages, warning_messages, sanitized_data)
    """
    errors: List[str] = []
    warnings: List[str] = []
    sanitized: Dict[str, Any] = dict(payload)

    # 1. Schema version
    schema_ver = payload.get("schema_version", CURRENT_SCHEMA_VERSION)
    if schema_ver != CURRENT_SCHEMA_VERSION:
        errors.append(
            f"Unsupported schema_version: {schema_ver}. Supported version is {CURRENT_SCHEMA_VERSION}."
        )

    # 2. ID
    if is_update or "id" in payload:
        raw_id = str(payload.get("id", ""))
        safe_id = sanitize_id(raw_id)
        if not safe_id:
            errors.append("Invalid or missing 'id'. Must be alphanumeric with hyphens/underscores/dots, max 64 chars.")
        else:
            sanitized["id"] = safe_id
    else:
        sanitized["id"] = generate_entry_id()

    # 3. Title
    raw_title = str(payload.get("title", "")).strip()
    if not raw_title:
        errors.append("Title is required.")
    elif len(raw_title) > MAX_TITLE_LENGTH:
        errors.append(f"Title must be at most {MAX_TITLE_LENGTH} characters.")
    sanitized["title"] = raw_title

    # 4. Summary
    raw_summary = str(payload.get("summary", "")).strip()
    if len(raw_summary) > MAX_SUMMARY_LENGTH:
        errors.append(f"Summary must be at most {MAX_SUMMARY_LENGTH} characters.")
    sanitized["summary"] = raw_summary

    # 5. Tags
    sanitized["tags"] = normalize_tags(payload.get("tags", []))

    # 6. Version
    ver_str = str(payload.get("version", "1.0.0")).strip()
    if not SEMVER_REGEX.match(ver_str):
        warnings.append(f"Version '{ver_str}' is not strict SemVer. Defaulting to 1.0.0.")
        ver_str = "1.0.0"
    sanitized["version"] = ver_str

    # 7. Workflow payload
    workflow = payload.get("workflow", {})
    if not isinstance(workflow, dict):
        errors.append("Workflow payload must be an object.")
        workflow = {"format": "comfyui-json", "data": {}}
    wf_data = workflow.get("data", {})
    if not isinstance(wf_data, dict):
        errors.append("Workflow 'data' must be a JSON object.")
        wf_data = {}

    sanitized["workflow"] = {
        "format": str(workflow.get("format", "comfyui-json")),
        "data": wf_data,
    }

    # Extract requirements & interfaces if not provided or to enrich
    req_node_classes, inf_inputs, inf_outputs = extract_workflow_requirements_and_interfaces(wf_data)

    existing_req = payload.get("requirements", {})
    if not isinstance(existing_req, dict):
        existing_req = {}
    combined_nodes = list(set(existing_req.get("node_classes", []) + req_node_classes))
    sanitized["requirements"] = {
        "node_classes": sorted(combined_nodes),
        "models": list(existing_req.get("models", [])),
    }

    existing_inf = payload.get("interfaces", {})
    if not isinstance(existing_inf, dict):
        existing_inf = {}
    final_inputs = existing_inf.get("inputs") or inf_inputs
    final_outputs = existing_inf.get("outputs") or inf_outputs
    sanitized["interfaces"] = {
        "inputs": final_inputs,
        "outputs": final_outputs,
    }

    # 8. Assets
    assets = payload.get("assets", {})
    if not isinstance(assets, dict):
        assets = {}
    preview_path = assets.get("preview")
    if preview_path:
        # Prevent traversal in preview path
        if ".." in str(preview_path) or "/" in str(preview_path).replace("\\", "/").strip("/"):
            # Normalize to safe basename or relative path within assets/
            clean_name = re.sub(r"[^a-zA-Z0-9_\-\.]", "_", str(preview_path).split("/")[-1].split("\\")[-1])
            preview_path = f"assets/{clean_name}" if clean_name else None
    sanitized["assets"] = {"preview": preview_path}

    is_valid = len(errors) == 0
    return is_valid, errors, warnings, sanitized
