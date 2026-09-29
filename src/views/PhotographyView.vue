<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCollections, type CollectionMeta } from '@/lib/content'
import { openPhotobook } from '@/lib/windows'
import CoverFlow from '@/components/CoverFlow.vue'

const collections = ref<CollectionMeta[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    collections.value = await getCollections()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

function open(item: CollectionMeta) {
  openPhotobook(item.slug, item.title)
}
</script>

<template>
  <div class="photography-window">
    <p v-if="loading">Loading collections…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <p v-else-if="collections.length === 0">
      No collections yet. Add a folder with a <code>config.md</code> under <code>content/photography/</code>.
    </p>
    <CoverFlow v-else :items="collections" @open="open" />
  </div>
</template>
