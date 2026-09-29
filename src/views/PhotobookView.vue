<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  collectionAssetUrl,
  getCollection,
  type CollectionImage,
  type CollectionMeta,
} from '@/lib/content'

const props = defineProps<{ slug: string }>()

const collection = ref<CollectionMeta | null>(null)
const loading = ref(true)
const error = ref('')
const pageIndex = ref(0)
const zoomImage = ref<CollectionImage | null>(null)
const bookRef = ref<HTMLElement | null>(null)

const pages = computed(() => collection.value?.pages ?? [])

onMounted(async () => {
  try {
    collection.value = await getCollection(props.slug)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
    bookRef.value?.focus()
  }
})

function imageUrl(file: string): string {
  return collectionAssetUrl(props.slug, file)
}

function goTo(i: number) {
  pageIndex.value = Math.max(0, Math.min(i, pages.value.length - 1))
}

function next() {
  goTo(pageIndex.value + 1)
}

function prev() {
  goTo(pageIndex.value - 1)
}

function magnify(img: CollectionImage) {
  zoomImage.value = img
}

function closeZoom() {
  zoomImage.value = null
}

function focusBook() {
  bookRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (zoomImage.value) {
    if (e.key === 'Escape') closeZoom()
    return
  }
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}
</script>

<template>
  <div ref="bookRef" class="photobook" tabindex="0" @keydown="onKeydown" @pointerdown="focusBook">
    <p v-if="loading" class="photobook-status">Loading photobook…</p>
    <p v-else-if="error" class="photobook-status text-red-600">{{ error }}</p>

    <template v-else-if="pages.length">
      <button
        type="button"
        class="photobook-nav photobook-nav-left"
        :disabled="pageIndex === 0"
        aria-label="Previous page"
        @click="prev"
      >‹</button>
      <button
        type="button"
        class="photobook-nav photobook-nav-right"
        :disabled="pageIndex === pages.length - 1"
        aria-label="Next page"
        @click="next"
      >›</button>

      <article class="photobook-page">
        <h2 v-if="pages[pageIndex].title" class="photobook-page-title">{{ pages[pageIndex].title }}</h2>
        <p v-if="pages[pageIndex].text" class="photobook-page-text">{{ pages[pageIndex].text }}</p>
        <div class="photobook-images" :class="{ single: (pages[pageIndex].images?.length ?? 0) === 1 }">
          <figure v-for="(img, i) in pages[pageIndex].images ?? []" :key="i" class="photobook-figure">
            <img :src="imageUrl(img.file)" :alt="img.caption ?? ''" draggable="false" @click="magnify(img)" />
            <figcaption v-if="img.caption" class="photobook-caption">{{ img.caption }}</figcaption>
            <p v-if="img.text" class="photobook-text">{{ img.text }}</p>
          </figure>
        </div>
      </article>

      <div class="photobook-footer">
        <span>{{ pageIndex + 1 }} / {{ pages.length }}</span>
      </div>
    </template>

    <p v-else class="photobook-status">This collection has no pages.</p>

    <div v-if="zoomImage" class="photobook-zoom" @click="closeZoom">
      <img :src="imageUrl(zoomImage.file)" :alt="zoomImage.caption ?? ''" />
      <span v-if="zoomImage.caption" class="photobook-zoom-caption">{{ zoomImage.caption }}</span>
    </div>
  </div>
</template>
