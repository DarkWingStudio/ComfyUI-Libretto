# Architecture

## Runtime shape

```text
ComfyUI
├── ComfyUI-Libretto Python package
│   ├── Registered Libretto nodes
│   ├── Prompt compiler and model profiles
│   ├── Preset store and collection engine
│   ├── Composition repository and migration manager
│   └── Local AioHTTP API
├── Libretto web extension
│   ├── Vue 3 sidebar application
│   ├── Prompt Composer
│   ├── Workflows & Library
│   └── ComfyUI graph integration utilities
├── library_presets/
│   ├── categories.yaml
│   ├── tags.yaml
│   └── <category>/*.yaml and optional thumbnails
└── data/
    ├── manifest.json
    ├── entries/
    ├── assets/
    └── backups/
```

The package entry point in [`__init__.py`](../__init__.py) creates a
`LibraryRepository`, registers API routes with ComfyUI's `PromptServer`, and
exposes the compiled frontend in `web/dist`.

## Prompt path

1. The web composer or a node supplies categorized components.
2. A model profile defines category order, separators, prefixes, negative
   prompt behavior, and generation defaults.
3. The compiler normalizes and combines components into a compiled positive and
   negative prompt.
4. The frontend can preview the result or inject it into compatible ComfyUI
   text nodes.

Profiles are data-driven YAML files under [`profiles/`](../profiles/). Built-in
profiles can also be represented by the Python profile manager.

## Composition path

1. A workflow is validated and scanned for node requirements and interfaces.
2. The repository canonicalizes the entry and computes its SHA-256 content
   hash.
3. The entry is written under `data/entries/` and indexed in `manifest.json`.
4. The frontend can inspect diagnostics, check compatibility, and apply the
   saved graph using smart merge or replacement behavior.

## Storage invariants

1. **Atomic writes:** repository files are written through a temporary file and
   replaced atomically.
2. **Rebuildable catalog:** the manifest can be rebuilt by scanning entry
   files if it is missing or invalid.
3. **Content identity:** canonical entry content receives a deterministic
   SHA-256 hash.
4. **Safe assets:** preview filenames are normalized and kept below the
   configured assets directory.
5. **Concurrency checks:** update and delete support `If-Match` to prevent
   lost updates.
6. **Recovery:** migration and repository operations can create backups before
   changing library state.

## Extension compatibility

The web extension registers with ComfyUI's modern sidebar API when available.
For older frontend versions it falls back to a floating drawer, so the Python
nodes and local API remain usable across a wider range of ComfyUI frontends.
