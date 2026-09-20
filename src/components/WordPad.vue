<script setup lang="ts">
import { ref, watch } from 'vue'
import { getPostMarkdown } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'

const props = defineProps<{ slug: string }>()

const html = ref('')
const loading = ref(true)
const error = ref('')

watch(
  () => props.slug,
  (slug) => {
    if (slug) void load(slug)
  },
  { immediate: true },
)

async function load(slug: string) {
  loading.value = true
  error.value = ''
  html.value = ''
  try {
    html.value = renderMarkdown(await getPostMarkdown(slug))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wordpad">
    <div class="menu-bar" role="menubar">
      <button type="button" tabindex="-1">File</button>
      <button type="button" tabindex="-1">Edit</button>
      <button type="button" tabindex="-1">View</button>
      <button type="button" tabindex="-1">Insert</button>
      <button type="button" tabindex="-1">Format</button>
      <button type="button" tabindex="-1">Help</button>
    </div>

    <div class="toolbar">
      <button type="button" tabindex="-1" title="New">New</button>
      <button type="button" tabindex="-1" title="Open">Open</button>
      <button type="button" tabindex="-1" title="Save">Save</button>
      <span class="sep"></span>
      <button type="button" tabindex="-1" title="Print">Print</button>
      <button type="button" tabindex="-1" title="Find">Find</button>
      <span class="sep"></span>
      <button type="button" tabindex="-1" title="Undo">Undo</button>
      <span class="sep"></span>
      <button type="button" tabindex="-1" title="Date/Time">Date/Time</button>
    </div>

    <div class="doc-area">
      <p v-if="loading">Loading article…</p>
      <p v-else-if="error" class="text-red-600">{{ error }}</p>
      <div v-else class="markdown-body" v-html="html"></div>
    </div>

    <div class="status-bar">
      <p class="status-bar-field">For Help, press F1</p>
    </div>
  </div>
</template>
