<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { collectionAssetUrl, type CollectionMeta } from '@/lib/content'

const props = defineProps<{ items: CollectionMeta[] }>()
const emit = defineEmits<{ open: [item: CollectionMeta] }>()

const active = ref(0)

// Cover-flow geometry: neighbours arc outward, rotated toward the front.
const SPREAD = 200
const DEPTH = 160
const TILT = 50

function coverStyle(i: number): CSSProperties {
  const k = i - active.value
  return {
    transform: `translateX(${k * SPREAD}px) translateZ(${-Math.abs(k) * DEPTH}px) rotateY(${k * -TILT}deg)`,
    zIndex: props.items.length - Math.abs(k),
  }
}

function coverSrc(item: CollectionMeta): string {
  return item.cover ? collectionAssetUrl(item.slug, item.cover) : ''
}

function select(i: number) {
  active.value = i
}

function open(i: number) {
  active.value = i
  emit('open', props.items[i])
}

function openActive() {
  const item = props.items[active.value]
  if (item) emit('open', item)
}

function step(delta: number) {
  if (props.items.length === 0) return
  active.value = (active.value + delta + props.items.length) % props.items.length
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    step(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    step(1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    openActive()
  }
}
</script>

<template>
  <div class="coverflow">
    <div class="coverflow-stage" tabindex="0" @keydown="onKeydown">
      <button
        v-for="(item, i) in items"
        :key="item.slug"
        type="button"
        class="coverflow-item"
        :class="{ active: i === active }"
        :style="coverStyle(i)"
        :title="item.title"
        @click="select(i)"
        @dblclick="open(i)"
      >
        <img v-if="coverSrc(item)" :src="coverSrc(item)" :alt="item.title" draggable="false" />
        <span v-else class="coverflow-fallback">{{ item.title }}</span>
      </button>
    </div>

    <div class="coverflow-bar">
      <div class="coverflow-info">
        <span class="coverflow-title">{{ items[active]?.title ?? '' }}</span>
        <span v-if="items[active]?.summary" class="coverflow-summary">{{ items[active].summary }}</span>
      </div>
      <button type="button" class="coverflow-open" :disabled="items.length === 0" @click="openActive">
        Open
      </button>
    </div>
  </div>
</template>
