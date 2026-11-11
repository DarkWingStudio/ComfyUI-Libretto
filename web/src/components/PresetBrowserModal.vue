<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog preset-browser-dialog">
      <!-- High-visibility Floating Toast Feedback -->
      <transition name="toast-fade">
        <div v-if="toastMessage" class="modal-floating-toast" :class="toastType">
          <span class="toast-icon">{{ toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : 'ℹ' }}</span>
          {{ toastMessage }}
        </div>
      </transition>

      <!-- Header -->
      <div class="modal-header">
        <div class="title-group">
          <h3 class="modal-title">Library Presets Browser</h3>
          <span class="count-badge">{{ totalPresets }} presets</span>
        </div>
        <div class="header-actions">
          <button class="new-preset-btn" @click="openCreateDialog">
            + New Preset
          </button>
          <button class="icon-tool-btn" title="Export Presets Pack (.zip)" @click="onExportPack">
            &#128229; Export Pack
          </button>
          <button class="icon-tool-btn" title="Import Presets (.zip, .yaml, .json)" @click="showImportDialog = true">
            &#128228; Import
          </button>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>
      </div>

      <!-- Controls: Category Pills & Source & Search -->
      <div class="browser-controls">
        <div class="search-and-source-row">
          <input
            v-model="searchQuery"
            type="text"
            class="browser-search-input"
            placeholder="Search presets by name, tags, description..."
            @input="onSearchInput"
          />

          <div class="source-toggle-group">
            <button
              class="source-btn"
              :class="{ active: selectedSource === 'all' }"
              @click="selectSource('all')"
            >
              All ({{ totalAll }})
            </button>
            <button
              class="source-btn"
              :class="{ active: selectedSource === 'bundled' }"
              @click="selectSource('bundled')"
            >
              Bundled ({{ totalBundled }})
            </button>
            <button
              class="source-btn"
              :class="{ active: selectedSource === 'user' }"
              @click="selectSource('user')"
            >
              Custom ({{ totalCustom }})
            </button>
          </div>
        </div>

        <div class="category-filter-row">
          <button
            class="cat-filter-btn"
            :class="{ active: selectedCategory === '' }"
            @click="selectCat('')"
          >
            All Categories
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-filter-btn"
            :class="{ active: selectedCategory === cat.id }"
            :style="selectedCategory === cat.id ? { borderColor: cat.color || '#3b82f6', color: cat.color || '#60a5fa' } : {}"
            @click="selectCat(cat.id)"
          >
            {{ cat.names?.['en-US'] || cat.name || cat.id }}
          </button>
        </div>
      </div>

      <!-- Preset Grid -->
      <div class="preset-grid-container">
        <div v-if="loading" class="loading-state">
          <span>Loading presets...</span>
        </div>

        <div v-else-if="presets.length === 0" class="empty-state">
          <p>No presets found in this filter.</p>
          <button v-if="selectedSource === 'user'" class="new-preset-btn" @click="openCreateDialog">
            + Create Your First Custom Preset
          </button>
        </div>

        <div v-else class="preset-grid">
          <div
            v-for="item in presets"
            :key="item.id"
            class="preset-card"
            :class="{ selected: (addedCountMap[item.id] || 0) > 0 }"
            @click="pickPreset(item)"
          >
            <!-- Thumbnail Box -->
            <div class="preset-thumb-box">
              <img
                v-if="item.has_thumb && !failedThumbs[item.id]"
                :src="getPresetThumbUrl(item.folder || item.category, item.id)"
                :alt="item.name"
                class="preset-thumb-img"
                loading="lazy"
                @error="onThumbError(item.id)"
              />
              <div
                v-else
                class="preset-thumb-fallback"
                :style="{ backgroundColor: (item.color || '#3b82f6') + '22', color: item.color || '#818cf8' }"
              >
                <span>{{ (item.name || item.id).substring(0, 2).toUpperCase() }}</span>
              </div>

              <span class="card-category-badge" :style="{ backgroundColor: item.color || '#4b5563' }">
                {{ item.category }}
              </span>

              <span v-if="item.is_custom" class="custom-badge" title="User custom preset">
                Custom
              </span>

              <button
                v-if="item.is_custom"
                class="delete-preset-icon-btn"
                title="Delete custom preset"
                @click.stop="onDeletePreset(item)"
              >
                &times;
              </button>
            </div>

            <!-- Card Info -->
            <div class="preset-card-body">
              <h4 class="preset-title" :title="item.name">{{ item.name }}</h4>
              <p class="preset-keywords" :title="item.keywords">
                {{ item.keywords || item.description }}
              </p>
            </div>

            <!-- Action: Add / Deselect controls -->
            <div class="card-action-bar" @click.stop>
              <template v-if="(addedCountMap[item.id] || 0) > 0">
                <div class="item-stepper">
                  <button
                    class="step-btn minus-btn"
                    title="Remove / Deselect one"
                    @click.stop="deselectPreset(item)"
                  >
                    &minus;
                  </button>
                  <span class="step-count">Added ({{ addedCountMap[item.id] }})</span>
                  <button
                    class="step-btn plus-btn"
                    title="Add another"
                    @click.stop="pickPreset(item)"
                  >
                    +
                  </button>
                </div>
              </template>
              <button
                v-else
                class="add-preset-btn"
                @click.stop="pickPreset(item)"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-status">
          <span v-if="totalAdded > 0" class="added-summary-pill">
            ✓ {{ totalAdded }} preset(s) active in composition
          </span>
          <span v-else class="hint-text">
            Click any preset or + to add. Use &minus; to deselect.
          </span>
        </div>
        <div class="footer-buttons">
          <button class="primary-done-btn" @click="$emit('close')">
            {{ totalAdded > 0 ? `Done (${totalAdded} Added)` : 'Close' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create Custom Preset Dialog with Image Upload -->
    <div v-if="showCreateDialog" class="nested-dialog-backdrop" @click.self="showCreateDialog = false">
      <div class="nested-dialog">
        <div class="nested-dialog-header">
          <h4>Create New Custom Preset</h4>
          <button class="close-btn" @click="showCreateDialog = false">&times;</button>
        </div>
        <div class="nested-dialog-body">
          <!-- Thumbnail / Image Uploader -->
          <div class="dialog-field">
            <label>Thumbnail / Image (Optional)</label>
            <div class="thumb-uploader-box">
              <div v-if="thumbnailPreview" class="thumb-preview-wrap">
                <img :src="thumbnailPreview" alt="Preset Thumbnail" class="thumb-preview-img" />
                <button class="remove-thumb-btn" @click="removeImage">&times; Remove Image</button>
              </div>
              <label v-else class="thumb-drop-zone">
                <span class="drop-icon">&#128247;</span>
                <span class="drop-text">Click to choose image or drag & drop</span>
                <span class="drop-sub">(PNG, JPG, WebP)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style="display: none"
                  @change="onImageFileChange"
                />
              </label>
            </div>
          </div>

          <div class="dialog-field">
            <label>Preset Name *</label>
            <input v-model="newPresetForm.name" type="text" placeholder="e.g. Cyberpunk Katana Girl" class="dialog-input" />
          </div>

          <div class="dialog-field">
            <label>Category</label>
            <select v-model="newPresetForm.category" class="dialog-select">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.names?.['en-US'] || cat.name || cat.id }}
              </option>
            </select>
          </div>

          <div class="dialog-field">
            <label>Keywords / Positive Prompt *</label>
            <textarea
              v-model="newPresetForm.keywords"
              rows="3"
              placeholder="e.g. 1girl, cyberpunk jacket, glowing katana"
              class="dialog-textarea"
            ></textarea>
          </div>

          <div class="dialog-field">
            <label>Negative Prompt (optional)</label>
            <textarea
              v-model="newPresetForm.negative"
              rows="2"
              placeholder="e.g. low quality, blurry"
              class="dialog-textarea"
            ></textarea>
          </div>

          <div class="dialog-field-row">
            <div class="dialog-field" style="flex: 1">
              <label>Weight</label>
              <input v-model.number="newPresetForm.weight" type="number" step="0.05" min="0.1" max="3.0" class="dialog-input" />
            </div>
            <div class="dialog-field" style="flex: 2">
              <label>Description / Note</label>
              <input v-model="newPresetForm.description" type="text" placeholder="Short description" class="dialog-input" />
            </div>
          </div>
        </div>

        <div class="nested-dialog-footer">
          <button class="secondary-btn" @click="showCreateDialog = false">Cancel</button>
          <button class="primary-done-btn" :disabled="!newPresetForm.name.trim()" @click="submitCreatePreset">
            Save Preset
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal explaining format -->
    <div v-if="showImportDialog" class="nested-dialog-backdrop" @click.self="showImportDialog = false">
      <div class="nested-dialog">
        <div class="nested-dialog-header">
          <h4>Import Presets Pack or Files</h4>
          <button class="close-btn" @click="showImportDialog = false">&times;</button>
        </div>
        <div class="nested-dialog-body">
          <div class="import-info-box">
            <p class="info-title">&#128218; Supported Import Formats:</p>
            <ul class="info-list">
              <li><strong>Libretto Preset Pack (.zip):</strong> Full zip bundle exported from Libretto containing categories, presets, and thumbnails.</li>
              <li><strong>Single Preset (.yaml, .yml):</strong> Standalone preset definition file.</li>
              <li><strong>JSON Preset (.json):</strong> Preset metadata object.</li>
            </ul>
            <p class="info-sub">Imported presets will be automatically saved into your <code>user_presets/</code> directory so they are preserved across updates.</p>
          </div>

          <label class="import-drop-zone">
            <span class="drop-icon">&#128228;</span>
            <span class="drop-text">Click to browse file or drag & drop</span>
            <span class="drop-sub">(.zip, .yaml, .yml, .json)</span>
            <input
              type="file"
              accept=".zip,.yaml,.yml,.json"
              style="display: none"
              @change="onImportFileChange"
            />
          </label>
        </div>
        <div class="nested-dialog-footer">
          <button class="secondary-btn" @click="showImportDialog = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  deletePreset,
  fetchCategories,
  fetchLibraryPresets,
  getExportPresetsPackUrl,
  getPresetThumbUrl,
  importPresetsPack,
  savePreset,
} from "../api";
import { PresetItem, PromptCategory } from "../types";

const props = defineProps<{
  initialCounts?: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select", preset: PresetItem): void;
  (e: "deselect", preset: PresetItem): void;
}>();

const categories = ref<PromptCategory[]>([]);
const presets = ref<PresetItem[]>([]);
const totalPresets = ref(0);
const totalAll = ref(0);
const totalBundled = ref(0);
const totalCustom = ref(0);

const selectedCategory = ref("");
const selectedSource = ref("all");
const searchQuery = ref("");
const loading = ref(false);
const failedThumbs = ref<Record<string, boolean>>({});
const addedCountMap = ref<Record<string, number>>({ ...(props.initialCounts || {}) });

// Toast
const toastMessage = ref("");
const toastType = ref<"success" | "info" | "error">("info");
let toastTimer: any = null;

function showToast(msg: string, type: "success" | "info" | "error" = "info") {
  toastMessage.value = msg;
  toastType.value = type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2800);
}

// Create dialog state
const showCreateDialog = ref(false);
const showImportDialog = ref(false);
const thumbnailPreview = ref<string | null>(null);
const thumbnailBase64 = ref<string | null>(null);

const newPresetForm = ref({
  name: "",
  category: "character",
  keywords: "",
  negative: "",
  weight: 1.0,
  description: "",
});

function openCreateDialog() {
  thumbnailPreview.value = null;
  thumbnailBase64.value = null;
  newPresetForm.value = {
    name: "",
    category: selectedCategory.value || "character",
    keywords: "",
    negative: "",
    weight: 1.0,
    description: "",
  };
  showCreateDialog.value = true;
}

function onImageFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const res = event.target?.result as string;
    thumbnailPreview.value = res;
    thumbnailBase64.value = res;
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  thumbnailPreview.value = null;
  thumbnailBase64.value = null;
}

const totalAdded = computed(() => {
  return Object.values(addedCountMap.value).reduce((a, b) => a + b, 0);
});

let debounceTimer: any = null;
function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadPresets, 200);
}

function selectCat(catId: string) {
  selectedCategory.value = catId;
  loadPresets();
}

function selectSource(source: string) {
  selectedSource.value = source;
  loadPresets();
}

async function loadPresets() {
  loading.value = true;
  try {
    const res = await fetchLibraryPresets({
      category: selectedCategory.value || undefined,
      q: searchQuery.value || undefined,
      source: selectedSource.value,
      limit: 300,
    });
    presets.value = res.items;
    totalPresets.value = res.total;
    if (res.total_all !== undefined) totalAll.value = res.total_all;
    if (res.total_bundled !== undefined) totalBundled.value = res.total_bundled;
    if (res.total_custom !== undefined) totalCustom.value = res.total_custom;
  } catch (err) {
    console.warn("Failed to load library presets", err);
  } finally {
    loading.value = false;
  }
}

function pickPreset(preset: PresetItem) {
  addedCountMap.value[preset.id] = (addedCountMap.value[preset.id] || 0) + 1;
  emit("select", preset);
}

function deselectPreset(preset: PresetItem) {
  if (!addedCountMap.value[preset.id] || addedCountMap.value[preset.id] <= 0) return;
  addedCountMap.value[preset.id]--;
  if (addedCountMap.value[preset.id] === 0) {
    delete addedCountMap.value[preset.id];
  }
  emit("deselect", preset);
}

function onThumbError(id: string) {
  failedThumbs.value[id] = true;
}

async function submitCreatePreset() {
  if (!newPresetForm.value.name.trim()) return;
  try {
    const payload: any = { ...newPresetForm.value };
    if (thumbnailBase64.value) {
      payload.thumbnail_base64 = thumbnailBase64.value;
    }
    const res = await savePreset(payload);
    showToast(`✓ Created preset "${res.preset.name}"`, "success");
    showCreateDialog.value = false;
    await loadPresets();
  } catch (err: any) {
    showToast(`Failed: ${err.message}`, "error");
  }
}

async function onDeletePreset(preset: PresetItem) {
  if (!confirm(`Are you sure you want to delete custom preset "${preset.name}"?`)) return;
  try {
    await deletePreset(preset.category, preset.id);
    showToast(`Deleted preset "${preset.name}"`, "info");
    await loadPresets();
  } catch (err: any) {
    showToast(`Failed to delete: ${err.message}`, "error");
  }
}

function onExportPack() {
  const url = getExportPresetsPackUrl(selectedCategory.value || undefined, true);
  // Download safely via dynamic anchor without opening a blank tab
  const a = document.createElement("a");
  a.href = url;
  a.download = `libretto_presets_${selectedCategory.value || 'all'}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Downloading presets pack...", "info");
}

async function onImportFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  try {
    const res = await importPresetsPack(file);
    showToast(`✓ Successfully imported ${res.imported_presets} preset(s)!`, "success");
    showImportDialog.value = false;
    await loadPresets();
  } catch (err: any) {
    showToast(`Import failed: ${err.message}`, "error");
  } finally {
    input.value = "";
  }
}

onMounted(async () => {
  try {
    categories.value = await fetchCategories();
  } catch {
    categories.value = [];
  }
  loadPresets();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.preset-browser-dialog {
  position: relative;
  background: #18181d;
  border: 1px solid #2d2d38;
  border-radius: 10px;
  width: 92vw;
  max-width: 680px;
  height: 74vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  color: #e2e8f0;
  overflow: hidden;
}

/* Floating Toast */
.modal-floating-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-floating-toast.success {
  background: #047857;
  color: #ffffff;
  border: 1px solid #10b981;
}

.modal-floating-toast.info {
  background: #1d4ed8;
  color: #ffffff;
  border: 1px solid #3b82f6;
}

.modal-floating-toast.error {
  background: #be123c;
  color: #ffffff;
  border: 1px solid #f43f5e;
}

.toast-icon {
  font-weight: 700;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #282833;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #f3f4f6;
}

.count-badge {
  font-size: 10px;
  background: #2563eb22;
  color: #60a5fa;
  border: 1px solid #2563eb44;
  padding: 2px 7px;
  border-radius: 10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.new-preset-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.new-preset-btn:hover {
  background: #1d4ed8;
}

.icon-tool-btn {
  background: #282833;
  color: #cbd5e1;
  border: 1px solid #3b3b4a;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.icon-tool-btn:hover {
  background: #343444;
  color: #fff;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  margin-left: 4px;
}

.browser-controls {
  padding: 10px 14px 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #282833;
  background: #15151a;
}

.search-and-source-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.browser-search-input {
  flex: 1;
  background: #1f1f27;
  border: 1px solid #333342;
  color: #f3f4f6;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.browser-search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.source-toggle-group {
  display: flex;
  background: #1f1f27;
  border-radius: 6px;
  padding: 2px;
  border: 1px solid #2d2d3a;
}

.source-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.source-btn.active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.category-filter-row {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.cat-filter-btn {
  background: #1f1f27;
  border: 1px solid #2d2d3a;
  color: #94a3b8;
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.cat-filter-btn:hover {
  background: #282834;
  color: #e2e8f0;
}

.cat-filter-btn.active {
  background: #2563eb22;
  border-color: #2563eb;
  color: #60a5fa;
  font-weight: 600;
}

.preset-grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 13px;
  gap: 10px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
  gap: 10px;
}

.preset-card {
  background: #1f1f28;
  border: 1px solid #2c2c3b;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.preset-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.preset-card.selected {
  border-color: #059669;
}

.preset-thumb-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #16161b;
  overflow: hidden;
}

.preset-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preset-thumb-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
}

.card-category-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;
  padding: 1px 5px;
  border-radius: 3px;
}

.custom-badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  font-size: 8px;
  font-weight: 700;
  background: #8b5cf6;
  color: #fff;
  padding: 1px 4px;
  border-radius: 3px;
}

.delete-preset-icon-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(220, 38, 38, 0.85);
  color: #fff;
  border: none;
  font-size: 13px;
  line-height: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-preset-icon-btn:hover {
  background: #dc2626;
}

.preset-card-body {
  padding: 7px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preset-title {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-keywords {
  margin: 0;
  font-size: 9px;
  color: #94a3b8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.card-action-bar {
  padding: 0 6px 6px;
}

.add-preset-btn {
  width: 100%;
  background: #2563eb22;
  border: 1px solid #2563eb55;
  color: #60a5fa;
  font-size: 10px;
  padding: 4px 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.add-preset-btn:hover {
  background: #2563eb;
  color: #fff;
}

.item-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #064e3b;
  border: 1px solid #059669;
  border-radius: 4px;
  padding: 1px 3px;
}

.step-btn {
  background: transparent;
  border: none;
  color: #a7f3d0;
  font-size: 13px;
  font-weight: 700;
  padding: 1px 6px;
  cursor: pointer;
  line-height: 1;
}

.step-btn:hover {
  color: #ffffff;
}

.step-count {
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid #282833;
  background: #131317;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.added-summary-pill {
  font-size: 11px;
  font-weight: 600;
  color: #34d399;
  background: #05966922;
  border: 1px solid #05966955;
  padding: 2px 8px;
  border-radius: 10px;
}

.hint-text {
  font-size: 11px;
  color: #64748b;
}

.primary-done-btn {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.primary-done-btn:hover {
  background: #1d4ed8;
}

.secondary-btn {
  background: #2d2d3a;
  border: none;
  color: #e2e8f0;
  padding: 6px 14px;
  border-radius: 5px;
  font-size: 11px;
  cursor: pointer;
}

/* Nested dialog for creating custom preset */
.nested-dialog-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10020;
}

.nested-dialog {
  background: #1c1c24;
  border: 1px solid #333342;
  border-radius: 8px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
}

.nested-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #2a2a36;
}

.nested-dialog-header h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.nested-dialog-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dialog-field label {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}

.dialog-field-row {
  display: flex;
  gap: 10px;
}

.dialog-input,
.dialog-select,
.dialog-textarea {
  background: #131317;
  border: 1px solid #2d2d3a;
  color: #f3f4f6;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 11px;
}

.dialog-input:focus,
.dialog-select:focus,
.dialog-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.nested-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid #2a2a36;
  background: #16161c;
}

/* Image Uploader in modal */
.thumb-uploader-box {
  background: #141419;
  border: 1px dashed #374151;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.thumb-preview-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #4b5563;
}

.remove-thumb-btn {
  background: rgba(220, 38, 38, 0.2);
  color: #f87171;
  border: 1px solid #dc2626;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.thumb-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 8px 12px;
  text-align: center;
}

.drop-icon {
  font-size: 20px;
}

.drop-text {
  font-size: 11px;
  color: #93c5fd;
  font-weight: 600;
}

.drop-sub {
  font-size: 9px;
  color: #64748b;
}

/* Import Modal Info Box */
.import-info-box {
  background: #131318;
  border: 1px solid #2b2b38;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 11px;
}

.info-title {
  margin: 0 0 6px;
  font-weight: 700;
  color: #93c5fd;
}

.info-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-sub {
  margin: 8px 0 0;
  color: #94a3b8;
  font-size: 10px;
}

.import-drop-zone {
  margin-top: 10px;
  border: 2px dashed #3b82f6;
  background: #1e3a8a11;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  text-align: center;
}

.import-drop-zone:hover {
  background: #1e3a8a22;
}
</style>
