<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { TASKBAR_HEIGHT, taskbarActivate, windowsState } from '@/lib/windows'

const now = ref('')
let timer: number | undefined

onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 1000)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearInterval(timer)
})

function updateClock() {
  const d = new Date()
  const h = d.getHours()
  const hh = h % 12 === 0 ? 12 : h % 12
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ampm = h < 12 ? 'AM' : 'PM'
  now.value = `${hh}:${mm} ${ampm}`
}
</script>

<template>
  <div class="taskbar" :style="{ height: `${TASKBAR_HEIGHT}px` }">
    <button class="start-button" type="button" title="Start">Start</button>
    <div class="taskbar-windows">
      <button
        v-for="win in windowsState.windows"
        :key="win.id"
        type="button"
        class="task-button"
        :class="{ active: !win.minimized && windowsState.activeId === win.id }"
        @click="taskbarActivate(win.id)"
      >
        {{ win.title }}
      </button>
    </div>
    <div class="tray">
      <span class="tray-clock">{{ now }}</span>
    </div>
  </div>
</template>
