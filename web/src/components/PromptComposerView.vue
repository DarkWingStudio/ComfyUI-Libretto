<template>
  <div class="prompt-composer-view">
    <!-- Floating High-Visibility Toast Notification -->
    <transition name="toast-fade">
      <div v-if="toast.show" class="composer-floating-toast" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Profile Selection Header -->
    <div class="composer-section profile-card">
      <div class="section-title-row">
        <label class="section-label">Target Model Profile</label>
        <span class="profile-badge">{{ activeProfile?.target_model?.toUpperCase() || 'TAGS' }}</span>
      </div>
      <div class="profile-selector-group">
        <select v-model="selectedProfileId" class="profile-select" @change="onProfileChange">
          <option v-for="prof in profiles" :key="prof.id" :value="prof.id">
            {{ prof.name }}
          </option>
        </select>
      </div>
      <p class="profile-hint">
        {{ getProfileHint(selectedProfileId) }}
      </p>
    </div>

    <!-- Quick Add Component Ribbon -->
    <div class="composer-section">
      <div class="section-title-row">
        <label class="section-label">Add Component</label>
        <button class="browse-lib-text-btn" @click="showBrowserModal = true">
          &#128218; Browse Presets ({{ components.length }} Active)
        </button>
      </div>
      <div class="quick-add-ribbon">
        <button
          v-for="cat in quickCategories"
          :key="cat.id"
          class="ribbon-btn"
          @click="addComponent(cat.id, cat.name)"
        >
          + {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Components List -->
    <div class="composer-section components-section">
      <div class="section-title-row">
        <label class="section-label">Active Prompt Components ({{ components.length }})</label>
        <button
          v-if="components.length > 0"
          class="text-action-btn"
          title="Remove all active prompt component cards"
          @click="clearComponents"
        >
          Clear Components
        </button>
      </div>

      <div v-if="components.length === 0" class="empty-components-state">
        <p>No components added yet.</p>
        <p class="sub-text">Click a category above or "Browse Presets" to build your structured prompt.</p>
      </div>

      <div v-else class="component-card-list">
        <div
          v-for="(comp, index) in components"
          :key="index"
          class="component-card"
        >
          <div class="component-header">
            <span class="category-pill" :class="comp.category">{{ comp.category }}</span>
            <input
              v-model="comp.name"
              class="component-name-input"
              placeholder="Component name..."
              @input="onComponentFieldChange"
            />
            <div class="weight-control">
              <span class="weight-label">w:</span>
              <input
                v-model.number="comp.weight"
                type="number"
                step="0.05"
                min="0.1"
                max="3.0"
                class="weight-input"
                @input="onComponentFieldChange"
              />
            </div>
            <button class="save-comp-btn" title="Save component as reusable preset in user library" @click="saveComponentAsPreset(comp)">
              💾
            </button>
            <button class="remove-btn" title="Remove" @click="removeComponent(index)">
              &times;
            </button>
          </div>

          <div class="component-body">
            <!-- Keywords / Tags -->
            <div class="input-row">
              <label class="field-label">Keywords / Tags:</label>
              <textarea
                v-model="comp.keywords"
                class="comp-textarea"
                rows="2"
                placeholder="Comma separated tags e.g. 1girl, silver hair, blue eyes..."
                @input="onComponentFieldChange"
              ></textarea>
            </div>

            <!-- Description (Visible or toggleable for Flux) -->
            <div class="input-row">
              <label class="field-label">Natural Description (Flux / Photoreal):</label>
              <textarea
                v-model="comp.description"
                class="comp-textarea"
                rows="2"
                placeholder="Natural language descriptive sentence..."
                @input="onComponentFieldChange"
              ></textarea>
            </div>

            <!-- Negative tokens -->
            <div v-if="activeProfile?.supports_negative" class="input-row">
              <label class="field-label">Negative keywords:</label>
              <input
                v-model="comp.negative"
                class="comp-input"
                placeholder="Component-specific negative tokens..."
                @input="onComponentFieldChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Extra global positive and negative -->
    <div class="composer-section">
      <div class="input-row">
        <label class="field-label">Extra Global Positive:</label>
        <input
          v-model="extraPositive"
          class="comp-input"
          placeholder="Extra tags or text to append..."
          @input="onExtraChange"
        />
      </div>
      <div v-if="activeProfile?.supports_negative" class="input-row">
        <label class="field-label">Extra Global Negative:</label>
        <input
          v-model="extraNegative"
          class="comp-input"
          placeholder="Extra negative tags to append..."
          @input="onExtraChange"
        />
      </div>
    </div>

    <!-- Live Preview Cards -->
    <div class="composer-section preview-section">
      <div class="section-title-row">
        <label class="section-label">Live Compiled Output</label>
        <div class="preview-actions">
          <button class="primary-pill-btn" @click="onManualRefresh">Refresh</button>
          <button class="send-graph-btn" title="Update existing prompt nodes or add new ones on canvas" @click="onSendToGraph">
            &rarr; Apply to Graph
          </button>
        </div>
      </div>

      <div class="compiled-output-card positive-card">
        <div class="output-header">
          <span class="output-badge pos">Positive Prompt</span>
          <button class="copy-btn" @click="copyText(compiledPositive, 'Positive Prompt')">Copy</button>
        </div>
        <div class="output-content">
          {{ compiledPositive || '(Empty compiled prompt)' }}
        </div>
      </div>

      <div v-if="activeProfile?.supports_negative" class="compiled-output-card negative-card">
        <div class="output-header">
          <span class="output-badge neg">Negative Prompt</span>
          <button class="copy-btn" @click="copyText(compiledNegative, 'Negative Prompt')">Copy</button>
        </div>
        <div class="output-content">
          {{ compiledNegative || '(Empty negative prompt)' }}
        </div>
      </div>

      <!-- Detected LoRAs -->
      <div v-if="detectedLoras.length > 0" class="loras-ribbon">
        <span class="lora-header">Detected LoRAs:</span>
        <span v-for="(lora, lIdx) in detectedLoras" :key="lIdx" class="lora-tag">
          {{ lora.name }} ({{ lora.strength }})
        </span>
      </div>
    </div>

    <!-- Preset Browser Modal with 2-way select/deselect -->
    <PresetBrowserModal
      v-if="showBrowserModal"
      :initial-counts="presetCountsMap"
      @close="showBrowserModal = false"
      @select="onPresetSelected"
      @deselect="onPresetDeselected"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { compilePromptPreview, fetchProfiles, savePreset } from "../api";
import { ModelProfile, PresetItem } from "../types";
import { addPromptBuilderToGraph } from "../utils/graph";
import PresetBrowserModal from "./PresetBrowserModal.vue";

const STORAGE_KEY = "comfyui_libretto_composer_state_v1";

const profiles = ref<ModelProfile[]>([]);
const selectedProfileId = ref("sdxl");
const extraPositive = ref("");
const extraNegative = ref("");
const showBrowserModal = ref(false);

const toast = ref({
  show: false,
  message: "",
  type: "success" as "success" | "info" | "error",
});
let toastTimer: any = null;

function showToast(message: string, type: "success" | "info" | "error" = "success") {
  clearTimeout(toastTimer);
  toast.value = { show: true, message, type };
  toastTimer = setTimeout(() => {
    toast.value.show = false;
  }, 2800);
}

function onManualRefresh() {
  runCompile();
  persistState();
  showToast("✓ Prompt refreshed", "info");
}

interface LocalComponent {
  id?: string;
  name: string;
  category: string;
  keywords: string;
  description: string;
  negative: string;
  weight: number;
}

const components = ref<LocalComponent[]>([
  {
    name: "Character",
    category: "character",
    keywords: "1girl, solo, silver hair, bangs, blue eyes",
    description: "A beautiful young woman with long silver hair styled with front bangs and radiant blue eyes",
    negative: "",
    weight: 1.0,
  },
  {
    name: "Outfit",
    category: "costume",
    keywords: "cyberpunk leather jacket, luminous circuit accents, dark trousers",
    description: "Wearing a stylish cyberpunk leather jacket with subtle glowing circuitry",
    negative: "",
    weight: 1.0,
  },
  {
    name: "Environment",
    category: "environment",
    keywords: "tokyo rain street, neon signage, wet asphalt reflections",
    description: "Standing in a rain-slicked Tokyo alley illuminated by colourful neon billboards",
    negative: "",
    weight: 1.0,
  },
]);

const compiledPositive = ref("");
const compiledNegative = ref("");
const detectedLoras = ref<{ name: string; strength: number }[]>([]);

const quickCategories = [
  { id: "character", name: "Character" },
  { id: "costume", name: "Outfit" },
  { id: "hair", name: "Hair" },
  { id: "pose", name: "Pose" },
  { id: "expression", name: "Expression" },
  { id: "environment", name: "Environment" },
  { id: "lighting", name: "Lighting" },
  { id: "camera", name: "Camera" },
  { id: "style", name: "Art Style" },
];

const activeProfile = computed(() => {
  return profiles.value.find((p) => p.id === selectedProfileId.value) || null;
});

const presetCountsMap = computed(() => {
  const map: Record<string, number> = {};
  for (const c of components.value) {
    const key = c.id || c.name;
    if (key) {
      map[key] = (map[key] || 0) + 1;
    }
  }
  return map;
});

function getProfileHint(id: string): string {
  switch (id) {
    case "sdxl":
      return "Optimized for SDXL: Comma-separated tag ordering with automatic quality prefix tags and weight formatting.";
    case "pony":
      return "Optimized for Pony Diffusion V6: Prepends score_9 quality ratings and enforces tag-based anime formatting.";
    case "flux":
      return "Optimized for Flux.1: Uses natural language descriptive sentences joined with periods. Disables tag spam.";
    case "sd15":
      return "Optimized for Stable Diffusion 1.5: Classic tag weighting (keyword:1.2), masterpiece quality prefix, and negative tokens.";
    case "animagine":
      return "Optimized for Animagine XL & NoobAI: Score tags and Danbooru anime formatting.";
    case "illustrious":
      return "Optimized for Illustrious XL: Aesthetic ratings and anime quality tokens.";
    case "photoreal":
      return "Optimized for Photorealism: Cinematic 35mm film photography and realistic natural lighting.";
    default:
      return "Standard configuration.";
  }
}

function persistState() {
  try {
    const data = {
      components: components.value,
      selectedProfileId: selectedProfileId.value,
      extraPositive: extraPositive.value,
      extraNegative: extraNegative.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // ignore
  }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.components) && parsed.components.length > 0) {
        components.value = parsed.components;
      }
      if (parsed.selectedProfileId) {
        selectedProfileId.value = parsed.selectedProfileId;
      }
      if (typeof parsed.extraPositive === "string") {
        extraPositive.value = parsed.extraPositive;
      }
      if (typeof parsed.extraNegative === "string") {
        extraNegative.value = parsed.extraNegative;
      }
    }
  } catch (err) {
    // ignore
  }
}

function addComponent(catId: string, defaultName: string) {
  components.value.push({
    name: defaultName,
    category: catId,
    keywords: "",
    description: "",
    negative: "",
    weight: 1.0,
  });
  triggerCompile();
  persistState();
}

function removeComponent(index: number) {
  components.value.splice(index, 1);
  triggerCompile();
  persistState();
}

function clearComponents() {
  components.value = [];
  triggerCompile();
  persistState();
  showToast("Cleared active components (extra globals preserved)", "info");
}

function onComponentFieldChange() {
  triggerCompile();
  persistState();
}

function onExtraChange() {
  triggerCompile();
  persistState();
}

async function saveComponentAsPreset(comp: LocalComponent) {
  const name = comp.name.trim() || `${comp.category} Preset`;
  try {
    await savePreset({
      name,
      category: comp.category,
      keywords: comp.keywords,
      negative: comp.negative,
      weight: comp.weight,
      description: comp.description,
    });
    showToast(`✓ Saved "${name}" to user library!`, "success");
  } catch (err: any) {
    showToast(`Save failed: ${err.message}`, "error");
  }
}

function onProfileChange() {
  triggerCompile();
  persistState();
}

let debounceTimer: any = null;
function triggerCompile() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runCompile, 250);
}

async function runCompile() {
  try {
    const res = await compilePromptPreview({
      profile_id: selectedProfileId.value,
      components: components.value,
      extra_positive: extraPositive.value,
      extra_negative: extraNegative.value,
    });
    compiledPositive.value = res.positive;
    compiledNegative.value = res.negative;
    detectedLoras.value = res.loras || [];
  } catch (err) {
    console.warn("Failed to compile prompt preview", err);
  }
}

function onPresetSelected(preset: PresetItem) {
  components.value.push({
    id: preset.id,
    name: preset.name,
    category: preset.category,
    keywords: preset.keywords,
    description: preset.description || preset.keywords,
    negative: preset.negative || "",
    weight: preset.weight || 1.0,
  });
  triggerCompile();
  persistState();
  showToast(`✓ Added "${preset.name}"`, "success");
}

function onPresetDeselected(preset: PresetItem) {
  // Remove the last matching instance
  let foundIdx = -1;
  for (let i = components.value.length - 1; i >= 0; i--) {
    const c = components.value[i];
    if (c.id === preset.id || (c.name === preset.name && c.category === preset.category)) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx !== -1) {
    components.value.splice(foundIdx, 1);
    triggerCompile();
    persistState();
    showToast(`Removed 1 × "${preset.name}"`, "info");
  }
}

async function copyText(text: string, label: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast(`✓ Copied ${label} to clipboard!`, "success");
  } catch (err) {
    showToast(`Failed to copy: ${err}`, "error");
  }
}

function onSendToGraph() {
  const res = addPromptBuilderToGraph(
    selectedProfileId.value,
    components.value,
    compiledPositive.value,
    compiledNegative.value
  );
  showToast(res.message, res.success ? "success" : "error");
}

onMounted(async () => {
  loadSavedState();
  try {
    profiles.value = await fetchProfiles();
  } catch {
    profiles.value = [];
  }
  runCompile();
});
</script>

<style scoped>
.prompt-composer-view {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  overflow-y: auto;
  color: #e0e0e0;
}

/* Floating High-Visibility Toast */
.composer-floating-toast {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.composer-floating-toast.success {
  background: #047857;
  border: 1px solid #10b981;
  color: #ffffff;
}
.composer-floating-toast.info {
  background: #1d4ed8;
  border: 1px solid #3b82f6;
  color: #ffffff;
}
.composer-floating-toast.error {
  background: #be123c;
  border: 1px solid #f43f5e;
  color: #ffffff;
}

.toast-icon {
  font-weight: 700;
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.composer-section {
  background: #1e1e24;
  border: 1px solid #2e2e38;
  border-radius: 8px;
  padding: 12px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #3b82f622;
  color: #60a5fa;
  border: 1px solid #3b82f644;
}

.profile-select {
  width: 100%;
  background: #131317;
  border: 1px solid #374151;
  color: #f3f4f6;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  outline: none;
}

.profile-hint {
  font-size: 11px;
  color: #94a3b8;
  margin: 6px 0 0;
  line-height: 1.4;
}

.browse-lib-text-btn {
  background: #2563eb22;
  border: 1px solid #2563eb55;
  color: #60a5fa;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.browse-lib-text-btn:hover {
  background: #2563eb;
  color: #ffffff;
}

.text-action-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 11px;
  cursor: pointer;
}

.text-action-btn:hover {
  text-decoration: underline;
}

.quick-add-ribbon {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ribbon-btn {
  background: #282834;
  border: 1px solid #3a3a4c;
  color: #cbd5e1;
  padding: 4px 9px;
  border-radius: 5px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ribbon-btn:hover {
  background: #343444;
  color: #ffffff;
  border-color: #60a5fa;
}

.empty-components-state {
  text-align: center;
  padding: 20px 10px;
  color: #64748b;
  font-size: 12px;
}

.sub-text {
  font-size: 11px;
  color: #4b5563;
  margin-top: 4px;
}

.component-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-card {
  background: #16161b;
  border: 1px solid #2a2a35;
  border-radius: 6px;
  padding: 10px;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.category-pill {
  flex-shrink: 0;
  font-size: 10px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  background: #374151;
  color: #e5e7eb;
}

.category-pill.character { background: #7c3aed33; color: #a78bfa; border: 1px solid #7c3aed66; }
.category-pill.costume { background: #05966933; color: #34d399; border: 1px solid #05966966; }
.category-pill.hair { background: #d9770633; color: #fbbf24; border: 1px solid #d9770666; }
.category-pill.environment { background: #0284c733; color: #38bdf8; border: 1px solid #0284c766; }
.category-pill.lighting { background: #e11d4833; color: #fb7185; border: 1px solid #e11d4866; }
.category-pill.style { background: #9333ea33; color: #c084fc; border: 1px solid #9333ea66; }

.component-name-input {
  flex: 1;
  min-width: 60px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #33333f;
  color: #f3f4f6;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 4px;
}

.weight-control {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3px;
}

.weight-label {
  font-size: 10px;
  color: #9ca3af;
}

.weight-input {
  width: 44px;
  background: #111115;
  border: 1px solid #2e2e3a;
  color: #e5e7eb;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 4px;
}

.save-comp-btn {
  flex-shrink: 0;
  background: transparent;
  border: none;
  font-size: 13px;
  cursor: pointer;
  line-height: 1;
  padding: 2px 4px;
  opacity: 0.75;
  transition: opacity 0.15s ease;
}

.save-comp-btn:hover {
  opacity: 1;
}

.remove-btn {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}

.component-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field-label {
  font-size: 10px;
  color: #9ca3af;
}

.comp-textarea {
  background: #111115;
  border: 1px solid #2a2a35;
  border-radius: 4px;
  color: #f3f4f6;
  padding: 6px 8px;
  font-size: 11px;
  resize: vertical;
  line-height: 1.4;
}

.comp-input {
  background: #111115;
  border: 1px solid #2a2a35;
  border-radius: 4px;
  color: #f3f4f6;
  padding: 5px 8px;
  font-size: 11px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-pill-btn {
  background: #374151;
  border: none;
  color: #f3f4f6;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.primary-pill-btn:hover {
  background: #4b5563;
}

.send-graph-btn {
  background: #059669;
  border: none;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.send-graph-btn:hover {
  background: #047857;
}

.compiled-output-card {
  background: #141419;
  border-radius: 6px;
  border: 1px solid #292936;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.output-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 5px;
  border-radius: 3px;
}

.output-badge.pos {
  background: #05966933;
  color: #34d399;
}

.output-badge.neg {
  background: #dc262633;
  color: #f87171;
}

.copy-btn {
  background: #23232f;
  border: 1px solid #3b3b4f;
  color: #cbd5e1;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #2e2e3d;
  color: #ffffff;
}

.output-content {
  font-size: 11px;
  line-height: 1.4;
  color: #e2e8f0;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
  user-select: text;
}

.loras-ribbon {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  padding-top: 4px;
}

.lora-header {
  color: #94a3b8;
  font-weight: 600;
}

.lora-tag {
  background: #7c3aed22;
  border: 1px solid #7c3aed55;
  color: #c4b5fd;
  padding: 1px 6px;
  border-radius: 4px;
}
</style>
