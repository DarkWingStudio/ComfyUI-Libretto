# API reference

Libretto registers a local AioHTTP API under:

```text
/libretto/api/v1
```

Requests and responses use JSON unless noted otherwise. Errors have this
shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "human-readable message",
    "details": []
  }
}
```

## Health and composition library

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | Return API/schema versions and storage statistics. |
| `GET` | `/entries` | List compositions. Supports `q`, `tag`, `sort`, `limit`, and `cursor`. |
| `GET` | `/entries/{id}` | Return one composition and computed diagnostics. |
| `POST` | `/entries` | Validate and create a composition. |
| `PUT` | `/entries/{id}` | Update a composition. `If-Match` protects against stale writes. |
| `DELETE` | `/entries/{id}` | Delete a composition. `If-Match` is supported. |
| `POST` | `/validate` | Validate a draft without persisting it. |
| `POST` | `/scan_workflow` | Extract node requirements and Libretto interfaces from workflow JSON. |
| `POST` | `/entries/{id}/preview` | Store a base64-encoded preview image for an entry. |
| `GET` | `/assets/{filename}` | Serve a validated entry asset. |

`GET /entries` returns `items`, `total`, and `next_cursor`. Supported sort
values are `updated_at`, `title`, `title_desc`, and `created`.

## Import and export

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/export/{id}` | Download one portable `.libretto.json` package. |
| `GET` | `/export_all` | Download the complete library export. |
| `POST` | `/import` | Import a package or workflow JSON. |
| `POST` | `/migration/preview` | Preview migration of legacy workflow files. |
| `POST` | `/migration/run` | Execute a previously reviewed migration. |

`POST /import` accepts `dry_run=true|false` and
`conflict=rename|overwrite|skip` query parameters.

## Prompt composer

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/profiles` | List available model profiles. |
| `GET` | `/categories` | List prompt categories and ordering metadata. |
| `GET` | `/tags` | List configured preset tags. |
| `POST` | `/compile_preview` | Compile components into positive/negative prompt text. |

The compile request contains a `profile_id`, `components`, optional
`extra_positive` and `extra_negative` text, and an optional `seed`.

## Preset library

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/presets` | Search and paginate bundled/user presets. |
| `POST` | `/presets` | Create or update a user preset. |
| `GET` | `/presets/{category}/{id}` | Return one preset. |
| `DELETE` | `/presets/{category}/{id}` | Delete a user preset. |
| `GET` | `/presets/thumb/{category}/{id}` | Serve a preset thumbnail. |
| `GET` | `/presets/thumb/{id}` | Serve a directly addressed thumbnail. |
| `GET` | `/presets/export_pack` | Download a preset pack. |
| `POST` | `/presets/import_pack` | Import a preset pack. |

`GET /presets` supports `category`, `q`, `limit`, `offset`, and
`source=all|bundled|user`. Bundled presets are read-only; user presets are
stored under `user_presets/`.

## API safety

The API is designed for the local ComfyUI process and does not implement user
authentication. Do not bind it to an untrusted interface without placing
authentication and network controls in front of ComfyUI. See
[`SECURITY.md`](../SECURITY.md).
