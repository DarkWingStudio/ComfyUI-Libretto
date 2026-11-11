# Workflow migration guide

Libretto can inspect existing ComfyUI workflow JSON files and convert valid
workflows into versioned library compositions. Migration is intentionally
preview-first so existing files are not changed unexpectedly.

## Migration flow

1. **Discover** - provide a legacy workflow path or workspace folder.
2. **Preview** - Libretto validates each candidate, computes its deterministic
   identifier and content hash, detects duplicate content, and lists required
   node classes.
3. **Review** - remove invalid files or resolve duplicates before writing.
4. **Back up** - the migration manager snapshots the current entries and
   manifest under `data/backups/`.
5. **Run** - valid, non-duplicate workflows are converted to schema v1
   entries.
6. **Verify** - inspect the resulting manifest and entry diagnostics in the
   Workflows & Library tab.
7. **Recover** - restore the backup if a migration must be rolled back.

## API operations

The migration endpoints are:

- `POST /libretto/api/v1/migration/preview`
- `POST /libretto/api/v1/migration/run`

Use the preview response as the source of truth for the files that will be
written. A regular package import is preferable when the source is already a
`.libretto.json` package; use migration for older raw workflow JSON.

## Preserving compatibility

Before applying a migrated entry:

- install the custom nodes listed in its requirements;
- confirm the checkpoint and workflow template are available;
- compare the saved graph's input names with the target workflow;
- use smart apply first when you want to preserve the current graph;
- export a package or create a backup before bulk changes.

Migration does not install missing custom nodes, models, or ComfyUI itself.
Invalid JSON, schema violations, unsafe identifiers, and duplicate content
should be resolved before execution rather than bypassed.
