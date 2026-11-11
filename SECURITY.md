# Security Policy

## Scope and security model

ComfyUI-Libretto is intended to run locally inside a ComfyUI installation. It
does not provide a public authentication layer and should not be exposed
directly to an untrusted network.

The extension's security boundaries include:

- JSON payload validation before compositions are persisted;
- sanitization of entry IDs, preset IDs, category names, and asset filenames;
- storage of preview assets beneath the configured data directory;
- JSON-only workflow parsing; the extension does not unpickle workflow data or
  execute Python supplied in a workflow payload;
- atomic repository writes, rebuildable manifests, and backups for recovery;
- optimistic concurrency checks through the optional `If-Match` header;
- bounded input fields and workflow payload validation.

These controls protect the Libretto storage and API surface. They do not make
ComfyUI, custom nodes, downloaded models, or imported workflow content safe.
Only import workflows and presets from sources you trust, and keep the
ComfyUI server behind an appropriate firewall or access control boundary.

## Reporting a vulnerability

Please do not publish security-sensitive details in a public issue. Report
vulnerabilities privately through the repository's security reporting channel
or contact the maintainers directly with:

1. a concise description and impact;
2. affected version or commit;
3. reproducible steps or a minimal proof of concept;
4. any suggested mitigation.

Do not include credentials, private workflow data, or other sensitive material
in the report unless it is required to reproduce the issue.

We will acknowledge valid reports, investigate the impact, and coordinate a
fix and disclosure timeline with the reporter.

## Third-party material

Some prompt-preset ideas and visual assets were adapted from
[Higeneko9/Libretto](https://github.com/Higeneko9/Libretto). Security reports
about upstream material should also be reported to the upstream maintainers
when the issue is not specific to this repository.
