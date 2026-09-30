<script setup lang="ts">
defineProps<{ label: string; selected?: boolean }>()

const emit = defineEmits<{ select: []; open: [] }>()

function onSelect() {
  emit('select')
}

function onOpen() {
  emit('open')
}
</script>

<template>
  <button
    type="button"
    class="desktop-icon"
    :class="{ selected }"
    :title="label"
    @click="onSelect"
    @dblclick="onOpen"
  >
    <slot />
    <span class="desktop-icon-label">{{ label }}</span>
  </button>
</template>
