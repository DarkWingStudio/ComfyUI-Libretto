<template>
  <div class="comfyui-libretto-container">
    <!-- Top Header -->
    <header class="libretto-header">
      <div class="brand-group" @click="activeEntryId = null">
        <span class="libretto-icon">&para;</span>
        <span class="brand-title">Libretto</span>
      </div>

      <div class="header-actions">
        <button class="libretto-icon-btn" title="Import Composition" @click="showImportModal = true">
          &uarr;
        </button>
        <button class="libretto-icon-btn" title="Settings & Storage" @click="showSettingsModal = true">
          &#9881;
        </button>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="libretto-nav-tabs">
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'composer' }"
        @click="currentTab = 'composer'; activeEntryId = null"
      >
        Prompt Composer
      </button>
      <button
        class="tab-btn"
        :class="{ active: currentTab === 'library' }"
        @click="currentTab = 'library'"
      >
        Workflows & Library
      </button>
    </nav>

    <!-- Main Content Area -->
    <main class="libretto-main">
      <PromptComposerView v-if="currentTab === 'composer'" />
      <template v-else>
        <DetailView
          v-if="activeEntryId"
          :entry-id="activeEntryId"
          @back="activeEntryId = null"
          @entry-deleted="onEntryDeleted"
        />
        <LibraryView
          v-else
          ref="libraryRef"
          @select-entry="activeEntryId = $event"
          @quick-apply="onQuickApply"
          @open-save="showSaveModal = true"
        />
      </template>
    </main>

    <!-- Modals -->
    <SaveCompositionModal
      v-if="showSaveModal"
      @close="showSaveModal = false"
      @saved="onCompositionSaved"
    />

    <ImportExportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="onImported"
    />

    <SettingsModal
      v-if="showSettingsModal"
      @close="showSettingsModal = false"
      @refreshed="refreshLibrary"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LibraryView from "./components/LibraryView.vue";
import DetailView from "./components/DetailView.vue";
import PromptComposerView from "./components/PromptComposerView.vue";
import SaveCompositionModal from "./components/SaveCompositionModal.vue";
import ImportExportModal from "./components/ImportExportModal.vue";
import SettingsModal from "./components/SettingsModal.vue";
import { getEntry } from "./api";
import { applyWorkflowToGraph } from "./utils/graph";

const currentTab = ref<"composer" | "library">("composer");
const libraryRef = ref<any>(null);
const activeEntryId = ref<string | null>(null);

const showSaveModal = ref(false);
const showImportModal = ref(false);
const showSettingsModal = ref(false);

async function onQuickApply(id: string) {
  try {
    const res = await getEntry(id);
    if (!res.entry?.workflow?.data) {
      alert("Composition contains no workflow data.");
      return;
    }
    applyWorkflowToGraph(res.entry.workflow.data, "smart_apply");
  } catch (err: any) {
    alert(`Could not apply composition: ${err.message}`);
  }
}

function onCompositionSaved(entryId: string) {
  showSaveModal.value = false;
  activeEntryId.value = entryId;
  refreshLibrary();
}

function onImported() {
  showImportModal.value = false;
  refreshLibrary();
}

function onEntryDeleted() {
  activeEntryId.value = null;
  refreshLibrary();
}

function refreshLibrary() {
  if (libraryRef.value?.refresh) {
    libraryRef.value.refresh();
  }
}
</script>

<style>
/* Scoped & Global Libretto styles conforming to ComfyUI UI standards */
.comfyui-libretto-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1a1a1e;
  color: #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  overflow: hidden;
  box-sizing: border-box;
}

.libretto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #141416;
  border-bottom: 1px solid #28282d;
}

.libretto-nav-tabs {
  display: flex;
  background: #111113;
  border-bottom: 1px solid #28282d;
  padding: 0 8px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: #f3f4f6;
}

.tab-btn.active {
  color: #60a5fa;
  border-bottom-color: #3b82f6;
  background: #1a1a2044;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.libretto-icon {
  font-size: 16px;
  color: #818cf8;
  font-weight: bold;
}

.brand-title {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #f3f4f6;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.libretto-icon-btn {
  background: transparent;
  border: 1px solid #323238;
  color: #9ca3af;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.libretto-icon-btn:hover {
  background: #2a2a30;
  color: #fff;
  border-color: #4b5563;
}

.libretto-main {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Global button, input, select styles */
.libretto-btn {
  background: #2e2e34;
  color: #e5e7eb;
  border: 1px solid #43434b;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
  user-select: none;
  text-decoration: none;
}

.libretto-btn:hover:not(:disabled) {
  background: #3a3a42;
  border-color: #6366f1;
}

.libretto-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.libretto-btn.primary {
  background: #4f46e5;
  border-color: #6366f1;
  color: #ffffff;
}

.libretto-btn.primary:hover:not(:disabled) {
  background: #4338ca;
}

.libretto-btn.danger {
  background: #991b1b;
  border-color: #ef4444;
  color: #fff;
}

.libretto-btn.danger:hover:not(:disabled) {
  background: #7f1d1d;
}

.libretto-btn.btn-sm {
  padding: 3px 8px;
  font-size: 11px;
}

.libretto-btn.full-width {
  width: 100%;
}

.libretto-input,
.libretto-select,
.libretto-textarea {
  background: #242428;
  border: 1px solid #383840;
  color: #f3f4f6;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;
}

.libretto-input:focus,
.libretto-select:focus,
.libretto-textarea:focus {
  border-color: #6366f1;
}

.libretto-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  color: #9ca3af;
  text-align: center;
  gap: 10px;
}

.libretto-state-box.error {
  color: #f87171;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: libretto-spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes libretto-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
