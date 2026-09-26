<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { TASKBAR_HEIGHT, taskbarActivate, windowsState } from '@/lib/windows'
import SuitcaseIcon from '@/components/SuitcaseIcon.vue'
import FileIcon from '@/components/FileIcon.vue'
import StartMenu from '@/components/StartMenu.vue'

const now = ref('')
const startMenuOpen = ref(false)
const shutdown = ref(false)
let timer: number | undefined

onMounted(() => {
  updateClock()
  timer = window.setInterval(updateClock, 1000)
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearInterval(timer)
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})

function updateClock() {
  const d = new Date()
  const h = d.getHours()
  const hh = h % 12 === 0 ? 12 : h % 12
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ampm = h < 12 ? 'AM' : 'PM'
  now.value = `${hh}:${mm} ${ampm}`
}

function toggleStart() {
  startMenuOpen.value = !startMenuOpen.value
}

function closeStart() {
  startMenuOpen.value = false
}

function onShutdown() {
  shutdown.value = true
}

function onDocumentPointerDown(e: PointerEvent) {
  if (!startMenuOpen.value) return
  const target = e.target as HTMLElement
  if (target.closest('.start-menu') || target.closest('.start-button')) return
  startMenuOpen.value = false
}

function restart() {
  window.location.reload()
}
</script>

<template>
  <div class="taskbar" :style="{ height: `${TASKBAR_HEIGHT}px` }">
    <button class="start-button" type="button" title="Start" @click="toggleStart">
      <svg class="start-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <!-- crown (top, lighter) facets -->
        <polygon points="8,1 3,8 6,8" fill="#b084dd" />
        <polygon points="8,1 6,8 10,8" fill="#c39be0" />
        <polygon points="8,1 10,8 13,8" fill="#a678d4" />
        <!-- pavilion (bottom, darker) facets -->
        <polygon points="3,8 6,8 8,15" fill="#5b2d8f" />
        <polygon points="6,8 10,8 8,15" fill="#4a2a72" />
        <polygon points="10,8 13,8 8,15" fill="#3a1f5c" />
        <!-- outline -->
        <polygon points="8,1 13,8 8,15 3,8" fill="none" stroke="#220f3d" stroke-width="1" />
      </svg>
      Start
    </button>

    <div class="taskbar-windows">
      <button
        v-for="win in windowsState.windows"
        :key="win.id"
        type="button"
        class="task-button"
        :class="{ active: !win.minimized && windowsState.activeId === win.id }"
        @click="taskbarActivate(win.id)"
      >
        <SuitcaseIcon v-if="win.kind === 'explorer'" class="taskbar-icon" />
        <FileIcon v-else class="taskbar-icon" />
        <span class="task-button-label">{{ win.title }}</span>
      </button>
    </div>

    <div class="tray">
      <span class="tray-clock">{{ now }}</span>
    </div>

    <StartMenu v-if="startMenuOpen" @close="closeStart" @shutdown="onShutdown" />
  </div>

  <Teleport to="body">
    <div v-if="shutdown" class="shutdown-screen">
      <p class="shutdown-message">It's now safe to turn off your computer.</p>
      <button class="shutdown-restart" type="button" @click="restart">Restart</button>
    </div>
  </Teleport>
</template>
