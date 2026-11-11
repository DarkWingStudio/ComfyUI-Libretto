<template>
  <div class="libretto-modal-backdrop" @click.self="$emit('close')">
    <div class="libretto-modal-content">
      <div class="modal-header">
        <h4>Import Compositions</h4>
        <button class="modal-close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <p class="modal-desc">
          Upload a Libretto package file (<code>.libretto.json</code>) or any standard ComfyUI workflow JSON to add it to your local library.
        </p>

        <!-- File input -->
        <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
          <input
            ref="fileInputRef"
            type="file"
            accept=".json,.libretto.json"
            class="hidden-file-input"
            @change="handleFileSelect"
          />
          <div v-if="!selectedFile" class="drop-prompt" @click="triggerFileInput">
            <span class="upload-icon">&darr;</span>
            <span>Click to browse or drop JSON file here</span>
          </div>
          <div v-else class="file-chosen-box">
            <strong>{{ selectedFile.name }}</strong>
            <span class="file-size">{{ formatBytes(selectedFile.size) }}</span>
            <button class="libretto-btn btn-sm" @click="selectedFile = null; parsedPayload = null; previewResult = null">
              Clear
            </button>
          </div>
        </div>

        <!-- Conflict policy -->
        <div class="form-group">
          <label>If composition already exists in library:</label>
          <select v-model="conflictPolicy" class="libretto-select">
            <option value="rename">Create a copy (Rename)</option>
            <option value="overwrite">Overwrite existing</option>
            <option value="skip">Skip if already present</option>
          </select>
        </div>

        <!-- Dry Run Preview -->
        <div v-if="previewResult" class="preview-result-box">
          <div class="preview-title">Validation Preview</div>
          <div class="preview-info">
            <span>Title: <strong>{{ previewResult.entry_preview?.title }}</strong></span>
            <span>Nodes: <strong>{{ previewResult.entry_preview?.requirements?.node_classes?.length || 0 }} required</strong></span>
          </div>
          <div v-if="previewResult.warnings?.length" class="warnings-box">
            <span v-for="w in previewResult.warnings" :key="w">{{ w }}</span>
          </div>
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="libretto-btn" :disabled="importing" @click="$emit('close')">
          Cancel
        </button>
        <button
          class="libretto-btn primary"
          :disabled="importing || !parsedPayload"
          @click="performImport"
        >
          <span v-if="importing" class="spinner"></span>
          {{ importing ? "Importing..." : "Confirm Import" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { importPackage } from "../api";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "imported"): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const parsedPayload = ref<any>(null);
const previewResult = ref<any>(null);
const conflictPolicy = ref("rename");
const importing = ref(false);
const errorMessage = ref<string | null>(null);

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFile(target.files[0]);
  }
}

function handleDrop(e: DragEvent) {
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    processFile(e.dataTransfer.files[0]);
  }
}

async function processFile(file: File) {
  selectedFile.value = file;
  errorMessage.value = null;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    parsedPayload.value = data;

    // Run dry-run validation
    const preview = await importPackage(data, true, conflictPolicy.value);
    previewResult.value = preview;
  } catch (err: any) {
    errorMessage.value = `File could not be parsed: ${err.message}`;
    parsedPayload.value = null;
    previewResult.value = null;
  }
}

async function performImport() {
  if (!parsedPayload.value) return;
  importing.value = true;
  errorMessage.value = null;
  try {
    await importPackage(parsedPayload.value, false, conflictPolicy.value);
    emit("imported");
  } catch (err: any) {
    errorMessage.value = err.message || "Import failed.";
  } finally {
    importing.value = false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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

.modal-desc {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}

.hidden-file-input {
  display: none;
}

.drop-zone {
  border: 2px dashed #3f3f46;
  border-radius: 6px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
  background: #18181b;
  transition: border-color 0.15s;
}

.drop-zone:hover {
  border-color: #6366f1;
}

.drop-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
}

.upload-icon {
  font-size: 20px;
}

.file-chosen-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.file-size {
  color: #888;
  font-size: 11px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 11px;
  color: #9ca3af;
}

.preview-result-box {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-title {
  font-weight: 600;
  color: #a5b4fc;
}

.preview-info {
  display: flex;
  justify-content: space-between;
}

.warnings-box {
  color: #fbbf24;
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
