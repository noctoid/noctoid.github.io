<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ label: string }>()

const emit = defineEmits<{ open: [] }>()

const selected = ref(false)

function select() {
  selected.value = true
}

function open() {
  selected.value = false
  emit('open')
}
</script>

<template>
  <button
    type="button"
    class="desktop-icon"
    :class="{ selected }"
    :title="label"
    @click="select"
    @dblclick="open"
  >
    <slot />
    <span class="desktop-icon-label">{{ label }}</span>
  </button>
</template>
