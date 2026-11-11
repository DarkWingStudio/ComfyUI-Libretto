import {
  CompiledPromptResponse,
  LibraryEntryDetail,
  LibraryEntrySummary,
  ModelProfile,
  PresetItem,
  PromptCategory,
  StorageStats,
} from "./types";

const BASE_URL = "/libretto/api/v1";

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return await res.json();
}

export async function listEntries(params: {
  q?: string;
  tag?: string;
  sort?: string;
  limit?: number;
  cursor?: number;
}): Promise<{ items: LibraryEntrySummary[]; total: number; next_cursor: number | null }> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.tag) query.set("tag", params.tag);
  if (params.sort) query.set("sort", params.sort);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", String(params.cursor));

  const res = await fetch(`${BASE_URL}/entries?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to list entries: ${res.statusText}`);
  return await res.json();
}

export async function getEntry(id: string): Promise<{ entry: LibraryEntryDetail; diagnostics: any }> {
  const res = await fetch(`${BASE_URL}/entries/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch entry ${id}: ${res.statusText}`);
  return await res.json();
}

export async function createEntry(entry: Partial<LibraryEntryDetail>): Promise<{ entry: LibraryEntryDetail }> {
  const res = await fetch(`${BASE_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create entry: ${res.statusText}`);
  }
  return await res.json();
}

export async function updateEntry(id: string, entry: Partial<LibraryEntryDetail>, ifMatch?: string): Promise<{ entry: LibraryEntryDetail }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (ifMatch) headers["If-Match"] = ifMatch;

  const res = await fetch(`${BASE_URL}/entries/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update entry: ${res.statusText}`);
  }
  return await res.json();
}

export async function deleteEntry(id: string, ifMatch?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (ifMatch) headers["If-Match"] = ifMatch;

  const res = await fetch(`${BASE_URL}/entries/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete entry: ${res.statusText}`);
  }
}

export async function validatePayload(payload: any): Promise<{ valid: boolean; errors: string[]; warnings: string[]; requirements: any }> {
  const res = await fetch(`${BASE_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Validation request failed: ${res.statusText}`);
  return await res.json();
}

export async function importPackage(payload: any, dryRun = false, conflict = "rename") {
  const res = await fetch(`${BASE_URL}/import?dry_run=${dryRun}&conflict=${conflict}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Import failed: ${res.statusText}`);
  }
  return await res.json();
}

export function getExportAllUrl(): string {
  return `${BASE_URL}/export_all`;
}

export async function uploadPreview(entryId: string, imageBase64: string): Promise<{ preview: string }> {
  const res = await fetch(`${BASE_URL}/entries/${encodeURIComponent(entryId)}/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_base64: imageBase64 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload preview: ${res.statusText}`);
  }
  return await res.json();
}

export function getExportUrl(id: string): string {
  return `${BASE_URL}/export/${encodeURIComponent(id)}`;
}

export function getAssetUrl(previewPath: string): string {
  if (!previewPath) return "";
  const filename = previewPath.replace(/^assets\//, "");
  return `${BASE_URL}/assets/${encodeURIComponent(filename)}`;
}

export async function getStorageStats(): Promise<StorageStats> {
  const data = await fetchHealth();
  return data.storage;
}

export async function fetchProfiles(): Promise<ModelProfile[]> {
  const res = await fetch(`${BASE_URL}/profiles`);
  if (!res.ok) throw new Error(`Failed to fetch profiles: ${res.statusText}`);
  const data = await res.json();
  return data.profiles;
}

export async function fetchCategories(): Promise<PromptCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
  const data = await res.json();
  return data.categories;
}

export async function compilePromptPreview(payload: {
  profile_id: string;
  components: any[];
  extra_positive?: string;
  extra_negative?: string;
  seed?: number;
}): Promise<CompiledPromptResponse> {
  const res = await fetch(`${BASE_URL}/compile_preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to compile prompt: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchLibraryPresets(params: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
  source?: string;
}): Promise<{
  items: PresetItem[];
  total: number;
  offset: number;
  limit: number;
  total_all?: number;
  total_bundled?: number;
  total_custom?: number;
}> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.q) query.set("q", params.q);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));
  if (params.source) query.set("source", params.source);

  const res = await fetch(`${BASE_URL}/presets?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to list library presets: ${res.statusText}`);
  return await res.json();
}

export async function savePreset(payload: {
  category: string;
  name: string;
  keywords: string;
  negative?: string;
  weight?: number;
  id?: string;
  description?: string;
  thumbnail_base64?: string;
}): Promise<{ preset: PresetItem }> {
  const res = await fetch(`${BASE_URL}/presets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to save preset: ${res.statusText}`);
  }
  return await res.json();
}

export async function deletePreset(category: string, id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/presets/${encodeURIComponent(category)}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete preset: ${res.statusText}`);
  }
}

export function getExportPresetsPackUrl(category?: string, includeBundled = false): string {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (includeBundled) q.set("include_bundled", "true");
  return `${BASE_URL}/presets/export_pack?${q.toString()}`;
}

export async function importPresetsPack(file: File | Blob): Promise<{ imported_presets: number; categories: string[] }> {
  const res = await fetch(`${BASE_URL}/presets/import_pack`, {
    method: "POST",
    headers: { "Content-Type": "application/zip" },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to import presets pack: ${res.statusText}`);
  }
  return await res.json();
}

export function getPresetThumbUrl(category: string, id: string): string {
  if (category) {
    return `${BASE_URL}/presets/thumb/${encodeURIComponent(category)}/${encodeURIComponent(id)}`;
  }
  return `${BASE_URL}/presets/thumb/${encodeURIComponent(id)}`;
}

export async function fetchTags(): Promise<any> {
  const res = await fetch(`${BASE_URL}/tags`);
  if (!res.ok) throw new Error(`Failed to fetch tags: ${res.statusText}`);
  return await res.json();
}


