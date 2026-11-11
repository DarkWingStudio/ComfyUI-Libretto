# Compatibility

## Supported host requirements

| Component | Minimum | Recommended | Notes |
|---|---:|---:|---|
| Python | 3.9 | 3.10+ | Matches `pyproject.toml`. |
| ComfyUI | 0.3.x or later | Latest compatible release | The package registers nodes and API routes through ComfyUI. |
| ComfyUI frontend | Sidebar API optional | Current frontend | Older frontends use the fallback drawer. |
| Browser | Modern evergreen | Current Chrome, Firefox, or Edge | Required for the built Vue frontend. |
| Node.js/npm | Only for source builds | Current LTS | Not required after `web/dist` has been built. |

ComfyUI and its models are separate dependencies. Libretto does not bundle an
image-generation model or replace the ComfyUI server.

## Workflow compatibility

Libretto can store arbitrary JSON workflow payloads that satisfy its entry
schema. Applying a composition is most reliable when the target graph uses
the same custom node classes and compatible input names as the saved graph.
The entry detail view exposes detected node requirements to help identify
missing classes before applying.

Prompt profiles are formatting configurations, not model downloads. Check the
profile's workflow template and injection mapping against the checkpoint and
workflow installed in ComfyUI before generating.

## Frontend fallback

When `app.extensionManager.registerSidebarTab` is available, Libretto registers
a normal sidebar tab. If it is unavailable, the extension creates a floating
toggle and drawer instead. This changes presentation only; the same local API
and core functionality are used.

## Known boundaries

- Libretto does not provide authentication for its local API.
- It does not validate or sandbox arbitrary third-party custom nodes.
- Model checkpoints, samplers, and workflow inputs must be installed and
  configured in ComfyUI.
- Browser behavior depends on the ComfyUI frontend's extension APIs.
