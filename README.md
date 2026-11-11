# ComfyUI-Libretto

ComfyUI-Libretto is a local-first ComfyUI custom node and web extension for
building reusable prompts and workflow compositions.

It combines:

- categorized prompt presets for characters, costumes, poses, lighting,
  locations, styles, and other scene elements;
- model profiles for formatting prompts for SDXL, Pony, Flux, SD 1.5,
  Animagine, Illustrious, photoreal, and custom workflows;
- ComfyUI nodes for composing, merging, weighting, previewing, and inspecting
  prompts;
- a local library for saving, searching, importing, exporting, and applying
  complete workflow compositions.

Libretto does not generate images itself. ComfyUI, its installed models, and
the connected workflow perform generation.

## Features

### Prompt composition

Use the **Prompt Composer** sidebar to search preset categories, combine
components, select a model profile, preview the compiled positive and negative
prompts, and place the result into the active ComfyUI graph.

Bundled categories include:

`style`, `character`, `hair`, `costume`, `pose`, `emotion`, `props`,
`situation`, `location`, `lighting`, and `view`.

Presets are YAML files with optional thumbnail images. User-created presets are
stored separately from bundled presets and can be imported or exported as a
pack.

### ComfyUI nodes

The extension registers nodes for:

- asset inputs: character, outfit, hair, pose, expression, environment,
  lighting, camera, style, and custom prompt;
- model profiles: SDXL, Pony, Flux, SD 1.5, Animagine XL, Illustrious XL,
  photoreal, and custom;
- prompt building, merging, weighting, and preview;
- collections and category collections, including seeded selection;
- workflow metadata and generic Libretto input/output boundaries.

### Workflow library

The **Workflows & Library** tab can save the active graph as a Libretto
composition, inspect requirements, search by title or tag, apply a composition
to the current graph, replace the current graph, and export or import portable
`.libretto.json` packages. Imports support dry runs and rename, overwrite, or
skip conflict policies.

Library data is local and is stored under the configured data directory:

```text
data/
  manifest.json
  entries/
  assets/
  backups/
```

Set `LIBRETTO_DATA_DIR` to use another storage location. If it is not set,
the extension uses the repository's `data` directory.

## Installation

Install ComfyUI first, then clone this repository into its `custom_nodes`
directory:

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/DarkWingStudio/ComfyUI-Libretto.git
```

Restart ComfyUI. The Libretto sidebar extension and nodes should then be
available.

### Build the web extension from source

The repository includes the frontend source under [`web/`](web/). To rebuild
the bundled frontend:

```bash
cd web
npm install
npm run build
```

The Python test suite can be run from the repository root:

```bash
python -m unittest discover -s tests
```

## API

Libretto registers a local API at `/libretto/api/v1`. The complete endpoint
reference is in [`docs/api.md`](docs/api.md).

The API includes:

- health and storage diagnostics;
- composition CRUD, validation, workflow scanning, import, and export;
- preview assets and migration preview/run operations;
- model profiles, categories, tags, and prompt compilation;
- preset listing, creation, deletion, thumbnail access, and pack
  import/export.

## Documentation

- [`docs/api.md`](docs/api.md) - API routes, parameters, and response behavior.
- [`docs/architecture.md`](docs/architecture.md) - runtime components and
  storage invariants.
- [`docs/compatibility.md`](docs/compatibility.md) - host and frontend
  compatibility notes.
- [`docs/migration.md`](docs/migration.md) - migrating existing workflow JSON
  files safely.
- [`SECURITY.md`](SECURITY.md) - security model and vulnerability reporting.

## Attribution

Portions of this project, including prompt-preset organization, model-profile
ideas, and some bundled preset assets, are adapted from
[Higeneko9/Libretto](https://github.com/Higeneko9/Libretto), which is also MIT
licensed (Copyright (c) 2026 Higeneko9). ComfyUI-Libretto is a separate
ComfyUI custom-node implementation and is not affiliated with the upstream
project.

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Rohit.
