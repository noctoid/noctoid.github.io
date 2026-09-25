<script setup lang="ts">
import { ref } from 'vue'
import { openExplorer } from '@/lib/windows'
import SuitcaseIcon from '@/components/SuitcaseIcon.vue'

const selected = ref(false)

function select() {
  selected.value = true
}

function open() {
  selected.value = false
  openExplorer()
}
</script>

<template>
  <button
    type="button"
    class="desktop-icon"
    :class="{ selected }"
    title="Blogs"
    @click="select"
    @dblclick="open"
  >
    <SuitcaseIcon class="desktop-icon-img" />
    <span class="desktop-icon-label">Blogs</span>
  </button>
</template>
