<template>
  <div v-if="loading" class="libretto-state-box">
    <span class="spinner"></span> Loading composition details...
  </div>

  <div v-else-if="error" class="libretto-state-box error">
    <p>{{ error }}</p>
    <button class="libretto-btn" @click="$emit('back')">Back to Library</button>
  </div>

  <div v-else-if="entry" class="libretto-detail">
    <!-- Navigation Header -->
    <div class="detail-top-nav">
      <button class="libretto-btn btn-sm" @click="$emit('back')">
        &larr; Back
      </button>
      <div class="detail-top-actions">
        <a :href="getExportUrl(entry.id)" download class="libretto-btn btn-sm" title="Export as portable package">
          Export
        </a>
        <button class="libretto-btn btn-sm danger" @click="confirmDelete">
          Delete
        </button>
      </div>
    </div>

    <!-- Title and Metadata -->
    <div class="detail-header">
      <div class="title-row">
        <h3>{{ entry.title }}</h3>
        <span class="version-tag">v{{ entry.version }}</span>
      </div>
      <p v-if="entry.summary" class="summary-text">{{ entry.summary }}</p>
      <div class="tags-row">
        <span v-for="t in entry.tags" :key="t" class="tag-chip">#{{ t }}</span>
      </div>
    </div>

    <!-- Preview if available -->
    <div v-if="entry.assets?.preview" class="preview-box">
      <img :src="getAssetUrl(entry.assets.preview)" alt="Preview" class="preview-img" />
    </div>

    <!-- Dependency Compatibility Check -->
    <div class="detail-section">
      <h5 class="section-title">Requirements & Compatibility</h5>
      <div v-if="missingNodes.length > 0" class="missing-alert">
        <strong>Missing Custom Nodes ({{ missingNodes.length }}):</strong>
        <p class="missing-desc">The following node classes are required by this composition but are not currently loaded in ComfyUI:</p>
        <ul class="missing-list">
          <li v-for="node in missingNodes" :key="node">{{ node }}</li>
        </ul>
      </div>

      <div v-else-if="installedNodes.length > 0" class="compatible-alert">
        All {{ installedNodes.length }} required node classes are installed and ready.
      </div>

      <div v-else class="text-muted">
        No specific custom node requirements recorded.
      </div>
    </div>

    <!-- Interfaces: Inputs & Outputs -->
    <div class="detail-section">
      <h5 class="section-title">Composition Interfaces</h5>
      <div v-if="entry.interfaces.inputs.length === 0 && entry.interfaces.outputs.length === 0" class="text-muted">
        No LibrettoInput or LibrettoOutput sockets declared.
      </div>

      <div v-if="entry.interfaces.inputs.length > 0" class="interface-group">
        <span class="interface-group-label">Composition Parameters (Adjust Before Applying):</span>
        <div v-for="inp in entry.interfaces.inputs" :key="inp.name" class="param-control-card">
          <div class="param-header">
            <span class="param-name">{{ inp.name }}</span>
            <span class="type-badge">{{ inp.value_type }}</span>
          </div>
          <p v-if="inp.description" class="param-desc">{{ inp.description }}</p>

          <input
            v-if="inp.value_type === 'INT'"
            v-model.number="paramValues[inp.name]"
            type="number"
            class="libretto-input param-input"
          />
          <input
            v-else-if="inp.value_type === 'FLOAT'"
            v-model.number="paramValues[inp.name]"
            type="number"
            step="0.05"
            class="libretto-input param-input"
          />
          <label v-else-if="inp.value_type === 'BOOLEAN'" class="param-checkbox-label">
            <input v-model="paramValues[inp.name]" type="checkbox" />
            <span>Enable</span>
          </label>
          <input
            v-else
            v-model="paramValues[inp.name]"
            type="text"
            class="libretto-input param-input"
          />
        </div>
      </div>

      <div v-if="entry.interfaces.outputs.length > 0" class="interface-group">
        <span class="interface-group-label">Declared Outputs:</span>
        <div v-for="outp in entry.interfaces.outputs" :key="outp.name" class="interface-pill output-pill">
          <strong>{{ outp.name }}</strong>
          <span v-if="outp.description" class="desc-badge">{{ outp.description }}</span>
        </div>
      </div>
    </div>

    <!-- Apply Actions -->
    <div class="apply-section">
      <button class="libretto-btn primary full-width" @click="applyComposition('smart_apply')">
        Apply / Adjust Active Graph
      </button>

      <button
        v-if="canUndo"
        class="libretto-btn full-width revert-btn"
        @click="undoApply"
      >
        &#x21ba; Revert / Undo Last Apply
      </button>

      <div v-if="applyNotice" class="apply-notice-banner">
        {{ applyNotice }}
      </div>

      <div class="apply-secondary-row">
        <button class="libretto-btn btn-sm text-xs" @click="applyComposition('insert_copy')">
          Insert Duplicate
        </button>
        <button class="libretto-btn btn-sm text-xs" @click="applyComposition('replace')">
          Replace Entire Graph
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getEntry, deleteEntry, getExportUrl, getAssetUrl } from "../api";
import { checkNodeCompatibility, applyWorkflowToGraph, hasUndoSnapshot, restoreGraphUndoSnapshot } from "../utils/graph";
import { LibraryEntryDetail } from "../types";

const props = defineProps<{
  entryId: string;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "entry-deleted"): void;
}>();

const entry = ref<LibraryEntryDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const missingNodes = ref<string[]>([]);
const installedNodes = ref<string[]>([]);
const applyNotice = ref<string | null>(null);
const paramValues = ref<Record<string, any>>({});
const canUndo = ref(hasUndoSnapshot());

async function loadDetail() {
  loading.value = true;
  error.value = null;
  try {
    const res = await getEntry(props.entryId);
    entry.value = res.entry;

    // Check node classes against LiteGraph
    const reqNodes = res.entry.requirements?.node_classes || [];
    const check = checkNodeCompatibility(reqNodes);
    missingNodes.value = check.missing;
    installedNodes.value = check.installed;

    // Initialize parameter controls from inputs and workflow data
    const defaults: Record<string, any> = {};
    if (res.entry.interfaces?.inputs) {
      for (const inp of res.entry.interfaces.inputs) {
        defaults[inp.name] = inp.default_value !== null && inp.default_value !== undefined
          ? inp.default_value
          : (inp.value_type === "BOOLEAN" ? false : (inp.value_type === "INT" ? 0 : (inp.value_type === "FLOAT" ? 0.0 : "")));
      }
    }
    if (Array.isArray(res.entry.workflow?.data?.nodes)) {
      for (const n of res.entry.workflow.data.nodes) {
        if (n.type === "LibrettoInput" && Array.isArray(n.widgets_values)) {
          const pName = n.widgets_values[0];
          const vtype = String(n.widgets_values[1] || "STRING").toUpperCase();
          if (pName) {
            if (vtype === "INT") defaults[pName] = n.widgets_values[3] ?? 0;
            else if (vtype === "FLOAT") defaults[pName] = n.widgets_values[4] ?? 0.0;
            else if (vtype === "BOOLEAN") defaults[pName] = Boolean(n.widgets_values[5]);
            else defaults[pName] = n.widgets_values[2] ?? "";
          }
        }
      }
    }
    paramValues.value = defaults;
    canUndo.value = hasUndoSnapshot();
  } catch (err: any) {
    error.value = err.message || "Failed to load entry detail";
  } finally {
    loading.value = false;
  }
}

function applyComposition(mode: "smart_apply" | "insert_copy" | "replace") {
  if (!entry.value?.workflow?.data) {
    alert("Composition has no workflow data to apply.");
    return;
  }

  if (mode === "replace") {
    if (!confirm("This will replace your current workflow graph. Continue?")) {
      return;
    }
  }

  applyNotice.value = null;

  try {
    const result = applyWorkflowToGraph(entry.value.workflow.data, mode, paramValues.value);
    canUndo.value = hasUndoSnapshot();

    if (mode === "smart_apply") {
      const parts: string[] = [];
      if (result.adjustedCount > 0) parts.push(`Adjusted ${result.adjustedCount} existing node(s)`);
      if (result.addedCount > 0) parts.push(`Added ${result.addedCount} new node(s)`);
      applyNotice.value = parts.length > 0 ? parts.join(", ") : "Applied to graph.";
    } else if (mode === "insert_copy") {
      applyNotice.value = `Inserted ${result.addedCount} duplicate node(s).`;
    } else {
      applyNotice.value = "Active graph replaced.";
    }

    setTimeout(() => {
      applyNotice.value = null;
    }, 4500);
  } catch (err: any) {
    alert(`Could not apply workflow: ${err.message}`);
  }
}

function undoApply() {
  const success = restoreGraphUndoSnapshot();
  canUndo.value = hasUndoSnapshot();
  if (success) {
    applyNotice.value = "Graph restored to previous state.";
    setTimeout(() => {
      applyNotice.value = null;
    }, 3500);
  }
}

async function confirmDelete() {
  if (!entry.value) return;
  if (confirm(`Are you sure you want to delete "${entry.value.title}"?`)) {
    try {
      await deleteEntry(entry.value.id, entry.value.content_hash);
      emit("entry-deleted");
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  }
}

onMounted(() => {
  loadDetail();
});
</script>

<style scoped>
.libretto-detail {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.detail-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-top-actions {
  display: flex;
  gap: 6px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-row h3 {
  margin: 0;
  font-size: 16px;
  color: #fff;
}

.summary-text {
  font-size: 12px;
  color: #d1d5db;
  line-height: 1.4;
  margin: 0;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.preview-box {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #374151;
}

.preview-img {
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  background: #111;
}

.detail-section {
  background: #242427;
  border: 1px solid #38383e;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.missing-alert {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.missing-desc {
  margin: 4px 0;
  font-size: 11px;
}

.missing-list {
  margin: 4px 0 0 16px;
  padding: 0;
  font-family: monospace;
}

.compatible-alert {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.text-muted {
  font-size: 11px;
  color: #888;
}

.interface-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.interface-group-label {
  font-size: 11px;
  color: #9ca3af;
}

.interface-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1a1a1c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.input-pill {
  border-left: 3px solid #6366f1;
}

.output-pill {
  border-left: 3px solid #10b981;
}

.type-badge {
  background: #374151;
  color: #e5e7eb;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10px;
}

.desc-badge {
  color: #9ca3af;
  font-style: italic;
}

.revert-btn {
  background: #3f3f46;
  border-color: #52525b;
  color: #fbbf24;
}

.revert-btn:hover:not(:disabled) {
  background: #52525b;
  border-color: #f59e0b;
}

.param-control-card {
  background: #18181b;
  border: 1px solid #2e2e33;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.param-name {
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
}

.param-desc {
  margin: 0;
  font-size: 11px;
  color: #9ca3af;
  font-style: italic;
}

.param-input {
  width: 100%;
  margin-top: 2px;
}

.param-checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #d1d5db;
}

.apply-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.apply-notice-banner {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.5);
  color: #c7d2fe;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  text-align: center;
}

.apply-secondary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.text-xs {
  font-size: 10px;
  padding: 4px 6px;
}
</style>
