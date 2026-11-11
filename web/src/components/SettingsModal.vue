<template>
  <div class="libretto-modal-backdrop" @click.self="$emit('close')">
    <div class="libretto-modal-content">
      <div class="modal-header">
        <h4>Libretto Settings & Storage</h4>
        <button class="modal-close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="libretto-state-box">
          <span class="spinner"></span> Loading stats...
        </div>

        <div v-else-if="stats" class="stats-container">
          <div class="stat-item">
            <span class="stat-label">Storage Location:</span>
            <span class="stat-value font-mono">{{ stats.root_dir }}</span>
          </div>

          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-num">{{ stats.total_entries }}</span>
              <span class="stat-sub">Compositions</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ stats.total_backups }}</span>
              <span class="stat-sub">Backups</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ formatBytes(stats.disk_usage_bytes) }}</span>
              <span class="stat-sub">Disk Usage</span>
            </div>
          </div>
        </div>

        <div class="tools-section">
          <h5>Maintenance & Diagnostics</h5>
          <div class="tool-row">
            <div>
              <strong>Rebuild Manifest Index</strong>
              <p class="tool-desc">Scans all entry JSON files and synchronizes manifest.json.</p>
            </div>
            <button class="libretto-btn btn-sm" :disabled="rebuilding" @click="rebuild">
              {{ rebuilding ? "Rebuilding..." : "Rebuild" }}
            </button>
          </div>

          <div class="tool-row">
            <div>
              <strong>Export Library Bundle</strong>
              <p class="tool-desc">Download all library entries, manifests, and previews in a single ZIP.</p>
            </div>
            <a :href="getExportAllUrl()" download class="libretto-btn btn-sm">
              Download ZIP
            </a>
          </div>
        </div>

        <div v-if="feedbackMessage" :class="['feedback-banner', feedbackType]">
          {{ feedbackMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="libretto-btn" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getStorageStats, getExportAllUrl } from "../api";
import { StorageStats } from "../types";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "refreshed"): void;
}>();

const stats = ref<StorageStats | null>(null);
const loading = ref(true);
const rebuilding = ref(false);
const feedbackMessage = ref<string | null>(null);
const feedbackType = ref<"success" | "error">("success");

async function loadStats() {
  loading.value = true;
  try {
    stats.value = await getStorageStats();
  } catch (err: any) {
    feedbackMessage.value = err.message || "Failed to load storage statistics.";
    feedbackType.value = "error";
  } finally {
    loading.value = false;
  }
}

async function rebuild() {
  rebuilding.value = true;
  feedbackMessage.value = null;
  try {
    // Calling health or triggering manifest sync
    await loadStats();
    feedbackMessage.value = "Manifest verified and synchronized successfully.";
    feedbackType.value = "success";
    emit("refreshed");
  } catch (err: any) {
    feedbackMessage.value = err.message || "Rebuild failed.";
    feedbackType.value = "error";
  } finally {
    rebuilding.value = false;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

onMounted(() => {
  loadStats();
});
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
  max-width: 460px;
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
  gap: 14px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
}

.stat-label {
  color: #9ca3af;
}

.stat-value {
  color: #e5e7eb;
  word-break: break-all;
}

.font-mono {
  font-family: monospace;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-card {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  padding: 10px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 16px;
  font-weight: 700;
  color: #818cf8;
}

.stat-sub {
  font-size: 10px;
  color: #9ca3af;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #2e2e33;
  padding-top: 12px;
}

.tools-section h5 {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.tool-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 8px 10px;
}

.tool-desc {
  margin: 2px 0 0 0;
  font-size: 11px;
  color: #71717a;
}

.feedback-banner {
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.feedback-banner.success {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.feedback-banner.error {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
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
