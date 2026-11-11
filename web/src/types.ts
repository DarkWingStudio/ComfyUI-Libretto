export interface LibraryEntrySummary {
  id: string;
  title: string;
  path: string;
  content_hash: string;
  tags: string[];
  version: string;
  updated_at: string;
  requirements_count: number;
  preview?: string | null;
}

export interface InterfaceItem {
  name: string;
  value_type: string;
  description?: string | null;
  default_value?: any;
  node_id?: string | null;
}

export interface LibraryEntryDetail {
  schema_version: number;
  id: string;
  title: string;
  summary: string;
  tags: string[];
  version: string;
  created_at: string;
  updated_at: string;
  source: {
    kind: string;
    origin?: string | null;
  };
  compatibility: {
    comfyui: string;
    libretto: string;
  };
  requirements: {
    node_classes: string[];
    models: string[];
  };
  interfaces: {
    inputs: InterfaceItem[];
    outputs: InterfaceItem[];
  };
  assets: {
    preview?: string | null;
  };
  content_hash: string;
  workflow?: {
    format: string;
    data: any;
  };
}

export interface StorageStats {
  root_dir: string;
  total_entries: number;
  total_backups: number;
  disk_usage_bytes: number;
  schema_version: number;
}

export interface ModelProfile {
  id: string;
  name: string;
  target_model: string;
  format_style: string;
  separator: string;
  positive_prefix: string;
  positive_suffix: string;
  negative_prefix: string;
  negative_suffix: string;
  weight_template: string;
  supports_negative: boolean;
  category_order: string[];
}

export interface PromptCategory {
  id: string;
  name: string;
  names?: Record<string, string>;
  color?: string;
  folder?: string;
  has_color?: boolean;
}

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  keywords: string;
  description: string;
  negative: string;
  weight: number;
  has_thumb: boolean;
  color?: string;
  folder?: string;
  source?: string;
  is_custom?: boolean;
}


export interface CompiledPromptResponse {
  positive: string;
  negative: string;
  profile_id: string;
  format_style: string;
  components_used: any[];
  loras: { name: string; strength: number }[];
  generation_snapshot: any;
}

