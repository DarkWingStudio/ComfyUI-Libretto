<template>
  <div class="libretto-modal-backdrop" @click.self="$emit('close')">
    <div class="libretto-modal-content">
      <div class="modal-header">
        <h4>Save Active Graph as Libretto</h4>
        <button class="modal-close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <!-- Scope selector: Full graph vs Selected nodes -->
        <div class="form-group">
          <label>Composition Scope</label>
          <div class="scope-toggle-group">
            <button
              type="button"
              :class="['scope-btn', { active: saveScope === 'full' }]"
              @click="setScope('full')"
            >
              Full Graph ({{ fullGraphSummary?.nodeCount || 0 }} nodes)
            </button>
            <button
              type="button"
              :class="['scope-btn', { active: saveScope === 'selected' }]"
              :disabled="!selectedGraphSummary || selectedGraphSummary.nodeCount === 0"
              @click="setScope('selected')"
            >
              Selected Subgraph ({{ selectedGraphSummary?.nodeCount || 0 }} nodes)
            </button>
          </div>
        </div>

        <div v-if="activeGraphSummary" class="graph-info-banner">
          <span>Target: <strong>{{ activeGraphSummary.nodeCount }} nodes</strong></span>
          <span v-if="activeGraphSummary.inputCount > 0" class="badge">
            {{ activeGraphSummary.inputCount }} Inputs
          </span>
          <span v-if="activeGraphSummary.outputCount > 0" class="badge">
            {{ activeGraphSummary.outputCount }} Outputs
          </span>
        </div>

        <!-- Thumbnail capture option -->
        <div class="form-group checkbox-row">
          <label class="checkbox-label">
            <input v-model="capturePreview" type="checkbox" />
            <span>Capture canvas view as thumbnail preview</span>
          </label>
        </div>

        <div class="form-group">
          <label>Composition Title *</label>
          <input
            v-model="title"
            type="text"
            maxlength="120"
            placeholder="e.g. SDXL Refiner & Upscaler Pipeline"
            class="libretto-input"
          />
        </div>

        <div class="form-group">
          <label>Summary / Notes</label>
          <textarea
            v-model="summary"
            maxlength="2000"
            rows="3"
            placeholder="Describe what this composition accomplishes and expected inputs..."
            class="libretto-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Tags (comma-separated)</label>
          <input
            v-model="tagsStr"
            type="text"
            placeholder="portrait, upscaler, ksampler"
            class="libretto-input"
          />
        </div>

        <div class="form-group">
          <label>Semantic Version</label>
          <input
            v-model="version"
            type="text"
            placeholder="1.0.0"
            class="libretto-input"
          />
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="libretto-btn" :disabled="saving" @click="$emit('close')">
          Cancel
        </button>
        <button
          class="libretto-btn primary"
          :disabled="saving || !title.trim()"
          @click="save"
        >
          <span v-if="saving" class="spinner"></span>
          {{ saving ? "Saving..." : "Save to Library" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { createEntry, uploadPreview } from "../api";
import { getActiveGraphData, getSelectedNodesData, captureCanvasScreenshot } from "../utils/graph";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved", entryId: string): void;
}>();

const title = ref("");
const summary = ref("");
const tagsStr = ref("");
const version = ref("1.0.0");
const saving = ref(false);
const errorMessage = ref<string | null>(null);

const saveScope = ref<"full" | "selected">("full");
const capturePreview = ref(true);

const fullGraphSummary = ref<{
  nodeCount: number;
  inputCount: number;
  outputCount: number;
  data: any;
} | null>(null);

const selectedGraphSummary = ref<{
  nodeCount: number;
  inputCount: number;
  outputCount: number;
  data: any;
} | null>(null);

const activeGraphSummary = computed(() => {
  return saveScope.value === "selected" ? selectedGraphSummary.value : fullGraphSummary.value;
});

function countInterfaces(nodes: any[]): { inputCount: number; outputCount: number } {
  let inputCount = 0;
  let outputCount = 0;
  for (const n of nodes) {
    if (n.type === "LibrettoInput") inputCount++;
    if (n.type === "LibrettoOutput") outputCount++;
  }
  return { inputCount, outputCount };
}

function setScope(scope: "full" | "selected") {
  saveScope.value = scope;
}

onMounted(() => {
  try {
    const rawData = getActiveGraphData();
    if (rawData && Array.isArray(rawData.nodes)) {
      const counts = countInterfaces(rawData.nodes);
      fullGraphSummary.value = {
        nodeCount: rawData.nodes.length,
        inputCount: counts.inputCount,
        outputCount: counts.outputCount,
        data: rawData,
      };
    }

    // Check selected nodes
    const selData = getSelectedNodesData();
    if (selData && Array.isArray(selData.nodes) && selData.nodes.length > 0) {
      const counts = countInterfaces(selData.nodes);
      selectedGraphSummary.value = {
        nodeCount: selData.nodes.length,
        inputCount: counts.inputCount,
        outputCount: counts.outputCount,
        data: selData,
      };
      // Default to selected if user had a selection active
      saveScope.value = "selected";
    }
  } catch (err: any) {
    errorMessage.value = `Unable to extract active graph: ${err.message}`;
  }
});

async function save() {
  if (!title.value.trim()) {
    errorMessage.value = "Title is required.";
    return;
  }

  const targetData = activeGraphSummary.value?.data;
  if (!targetData) {
    errorMessage.value = "No workflow data available to save.";
    return;
  }

  saving.value = true;
  errorMessage.value = null;

  try {
    const tags = tagsStr.value
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (saveScope.value === "selected") {
      tags.push("subgraph");
    }

    const res = await createEntry({
      title: title.value.trim(),
      summary: summary.value.trim(),
      tags,
      version: version.value.trim() || "1.0.0",
      workflow: {
        format: "comfyui-json",
        data: targetData,
      },
    });

    const entryId = res.entry.id;

    // Capture preview if enabled
    if (capturePreview.value) {
      try {
        const screenshot = captureCanvasScreenshot();
        if (screenshot) {
          await uploadPreview(entryId, screenshot);
        }
      } catch (previewErr) {
        console.warn("Could not attach canvas preview screenshot:", previewErr);
      }
    }

    emit("saved", entryId);
  } catch (err: any) {
    errorMessage.value = err.message || "Failed to save composition.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.libretto-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.libretto-modal-content {
  background: #1f1f23;
  border: 1px solid #38383e;
  border-radius: 8px;
  width: 90%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2e2e33;
}

.modal-header h4 {
  margin: 0;
  font-size: 14px;
  color: #fff;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.graph-info-banner {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background: #4338ca;
  color: #c7d2fe;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
}

.scope-toggle-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.scope-btn {
  background: #242428;
  border: 1px solid #383840;
  color: #9ca3af;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.scope-btn.active {
  background: #3730a3;
  border-color: #6366f1;
  color: #ffffff;
  font-weight: 600;
}

.scope-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.checkbox-row {
  margin-top: 2px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #d1d5db;
}

.error-banner {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #2e2e33;
  background: #18181b;
}
</style>
