<template>
  <div class="libretto-library">
    <!-- Search & Filter Bar -->
    <div class="libretto-toolbar">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search compositions, tags..."
          class="libretto-input"
          @input="onSearchInput"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">&times;</button>
      </div>

      <div class="filter-row">
        <select v-model="sortBy" class="libretto-select" @change="fetchList">
          <option value="updated_at">Recently Updated</option>
          <option value="title">Alphabetical (A-Z)</option>
          <option value="title_desc">Alphabetical (Z-A)</option>
        </select>

        <button class="libretto-btn primary" @click="$emit('open-save')">
          + Save Active Graph
        </button>
      </div>
    </div>

    <!-- Active Tag Filter -->
    <div v-if="selectedTag" class="tag-filter-pill">
      <span>Tag: <strong>{{ selectedTag }}</strong></span>
      <button @click="setTag('')">&times;</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="libretto-state-box">
      <span class="spinner"></span> Loading library...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="libretto-state-box error">
      <p>{{ error }}</p>
      <button class="libretto-btn" @click="fetchList">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="libretto-state-box empty">
      <p v-if="searchQuery || selectedTag">No compositions match your search.</p>
      <div v-else>
        <p>No saved compositions found in your Libretto library.</p>
        <button class="libretto-btn primary" @click="$emit('open-save')">
          Save Current Graph as Libretto
        </button>
      </div>
    </div>

    <!-- Composition Cards List -->
    <div v-else class="entries-list">
      <div
        v-for="item in items"
        :key="item.id"
        class="entry-card"
        @click="$emit('select-entry', item.id)"
      >
        <div class="entry-header">
          <div class="entry-title-wrap">
            <h4 class="entry-title">{{ item.title }}</h4>
            <span class="version-tag">v{{ item.version }}</span>
          </div>
          <span class="date-text">{{ formatDate(item.updated_at) }}</span>
        </div>

        <div class="entry-meta">
          <div class="tags-container">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="tag-chip"
              @click.stop="setTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>
          <div class="req-indicator">
            {{ item.requirements_count }} required node types
          </div>
        </div>

        <div class="card-actions" @click.stop>
          <button
            class="libretto-btn btn-sm"
            title="Inspect metadata, dependencies, and interfaces"
            @click="$emit('select-entry', item.id)"
          >
            Inspect
          </button>
          <button
            class="libretto-btn btn-sm primary"
            title="Insert composition into active graph"
            @click="$emit('quick-apply', item.id)"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listEntries } from "../api";
import { LibraryEntrySummary } from "../types";

const emit = defineEmits<{
  (e: "select-entry", id: string): void;
  (e: "quick-apply", id: string): void;
  (e: "open-save"): void;
}>();

const items = ref<LibraryEntrySummary[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref("");
const selectedTag = ref("");
const sortBy = ref("updated_at");
let searchTimeout: any = null;

async function fetchList() {
  loading.value = true;
  error.value = null;
  try {
    const res = await listEntries({
      q: searchQuery.value,
      tag: selectedTag.value,
      sort: sortBy.value,
      limit: 100,
    });
    items.value = res.items;
    totalCount.value = res.total;
  } catch (err: any) {
    error.value = err.message || "Failed to load library";
  } finally {
    loading.value = false;
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchList();
  }, 250);
}

function clearSearch() {
  searchQuery.value = "";
  fetchList();
}

function setTag(tag: string) {
  selectedTag.value = tag;
  fetchList();
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

onMounted(() => {
  fetchList();
});

defineExpose({ refresh: fetchList });
</script>

<style scoped>
.libretto-library {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.libretto-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper input {
  width: 100%;
  padding-right: 28px;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 16px;
}

.filter-row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.tag-filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  width: fit-content;
}

.tag-filter-pill button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 2px;
}

.entry-card {
  background: #242427;
  border: 1px solid #38383e;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.entry-card:hover {
  border-color: #6366f1;
  background: #29292e;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.entry-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.entry-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #f3f4f6;
}

.version-tag {
  background: #374151;
  color: #9ca3af;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
}

.date-text {
  font-size: 11px;
  color: #888;
}

.entry-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-chip {
  background: #1f2937;
  color: #818cf8;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.tag-chip:hover {
  background: #374151;
}

.req-indicator {
  font-size: 11px;
  color: #9ca3af;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
}
</style>
