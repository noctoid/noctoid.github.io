<script setup lang="ts">
import { computed } from 'vue'
import {
  TASKBAR_HEIGHT,
  closeWindow,
  focus,
  minimizeWindow,
  moveWindow,
  resizeWindow,
  toggleMaximize,
  windowsState,
  type AppWindow,
} from '@/lib/windows'

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const props = withDefaults(
  defineProps<{
    win: AppWindow
    closable?: boolean
  }>(),
  { closable: true },
)

const active = computed(() => windowsState.activeId === props.win.id)

const frameStyle = computed(() => {
  const w = props.win
  if (w.maximized) {
    return {
      zIndex: w.z,
      left: '0px',
      top: '0px',
      width: '100%',
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
    }
  }
  return {
    zIndex: w.z,
    left: `${w.rect.x}px`,
    top: `${w.rect.y}px`,
    width: `${w.rect.width}px`,
    height: `${w.rect.height}px`,
  }
})

function onTitlePointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.title-bar-controls')) return
  startDrag(e)
}

function onTitleDblClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.title-bar-controls')) return
  toggleMaximize(props.win.id)
}

function startDrag(e: PointerEvent) {
  const win = props.win
  if (win.maximized) return
  focus(win.id)
  const startX = e.clientX
  const startY = e.clientY
  const origX = win.rect.x
  const origY = win.rect.y

  const onMove = (ev: PointerEvent) => {
    moveWindow(win.id, origX + ev.clientX - startX, origY + ev.clientY - startY)
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  e.preventDefault()
}

function startResize(e: PointerEvent, dir: Dir) {
  const win = props.win
  if (win.maximized) return
  focus(win.id)
  const startX = e.clientX
  const startY = e.clientY
  const orig = { ...win.rect }

  const onMove = (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    let x = orig.x
    let y = orig.y
    let width = orig.width
    let height = orig.height
    if (dir.includes('e')) width = orig.width + dx
    if (dir.includes('s')) height = orig.height + dy
    if (dir.includes('w')) {
      width = orig.width - dx
      x = orig.x + dx
    }
    if (dir.includes('n')) {
      height = orig.height - dy
      y = orig.y + dy
    }
    resizeWindow(win.id, { x, y, width, height })
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  e.preventDefault()
}
</script>

<template>
  <div
    v-show="!win.minimized"
    class="window-frame"
    :style="frameStyle"
    @pointerdown="focus(win.id)"
  >
    <div class="title-bar" :class="{ inactive: !active }" @pointerdown="onTitlePointerDown" @dblclick="onTitleDblClick">
      <div class="title-bar-text">{{ win.title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click.stop="minimizeWindow(win.id)"></button>
        <button :aria-label="win.maximized ? 'Restore' : 'Maximize'" @click.stop="toggleMaximize(win.id)"></button>
        <button v-if="closable" aria-label="Close" @click.stop="closeWindow(win.id)"></button>
      </div>
    </div>

    <div class="window-content">
      <slot />
    </div>

    <template v-if="!win.maximized">
      <div class="rh rh-n" @pointerdown.stop="startResize($event, 'n')"></div>
      <div class="rh rh-s" @pointerdown.stop="startResize($event, 's')"></div>
      <div class="rh rh-e" @pointerdown.stop="startResize($event, 'e')"></div>
      <div class="rh rh-w" @pointerdown.stop="startResize($event, 'w')"></div>
      <div class="rh rh-ne" @pointerdown.stop="startResize($event, 'ne')"></div>
      <div class="rh rh-nw" @pointerdown.stop="startResize($event, 'nw')"></div>
      <div class="rh rh-se" @pointerdown.stop="startResize($event, 'se')"></div>
      <div class="rh rh-sw" @pointerdown.stop="startResize($event, 'sw')"></div>
    </template>
  </div>
</template>
