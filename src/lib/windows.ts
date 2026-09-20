import { reactive } from 'vue'

export const TASKBAR_HEIGHT = 28
export const MIN_WIDTH = 320
export const MIN_HEIGHT = 200

export type WindowKind = 'explorer' | 'article'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface AppWindow {
  id: string
  kind: WindowKind
  title: string
  slug?: string
  rect: Rect
  z: number
  minimized: boolean
  maximized: boolean
  restoreRect: Rect | null
}

export const windowsState = reactive({
  windows: [] as AppWindow[],
  activeId: null as string | null,
})

let zTop = 0
let initialized = false

function workArea(): Rect {
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: Math.max(window.innerHeight - TASKBAR_HEIGHT, 120),
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi)
}

function find(id: string): AppWindow | undefined {
  return windowsState.windows.find((w) => w.id === id)
}

function recomputeActive(): void {
  const visible = windowsState.windows.filter((w) => !w.minimized)
  visible.sort((a, b) => b.z - a.z)
  windowsState.activeId = visible[0]?.id ?? null
}

export function focus(id: string): void {
  const win = find(id)
  if (!win) return
  if (windowsState.activeId !== id) {
    win.z = ++zTop
    windowsState.activeId = id
  }
}

export function openArticle(slug: string, title: string): string {
  const existing = windowsState.windows.find((w) => w.kind === 'article' && w.slug === slug)
  if (existing) {
    existing.minimized = false
    focus(existing.id)
    return existing.id
  }

  const n = windowsState.windows.filter((w) => w.kind === 'article').length
  const win: AppWindow = {
    id: `article:${slug}`,
    kind: 'article',
    title: `${title} - WordPad`,
    slug,
    rect: {
      x: 72 + (n % 8) * 28,
      y: 40 + (n % 8) * 28,
      width: 560,
      height: 420,
    },
    z: 0,
    minimized: false,
    maximized: false,
    restoreRect: null,
  }
  windowsState.windows.push(win)
  focus(win.id)
  return win.id
}

export function closeWindow(id: string): void {
  const i = windowsState.windows.findIndex((w) => w.id === id)
  if (i < 0) return
  if (windowsState.windows[i].kind === 'explorer') return // never close the desktop
  windowsState.windows.splice(i, 1)
  if (windowsState.activeId === id) recomputeActive()
}

export function minimizeWindow(id: string): void {
  const win = find(id)
  if (!win || win.minimized) return
  win.minimized = true
  if (windowsState.activeId === id) recomputeActive()
}

export function toggleMaximize(id: string): void {
  const win = find(id)
  if (!win) return
  if (win.maximized) {
    win.maximized = false
    if (win.restoreRect) win.rect = { ...win.restoreRect }
    win.restoreRect = null
  } else {
    win.restoreRect = { ...win.rect }
    win.maximized = true
  }
  focus(id)
}

export function moveWindow(id: string, x: number, y: number): void {
  const win = find(id)
  if (!win || win.maximized) return
  const area = workArea()
  win.rect.x = clamp(x, -(win.rect.width - 120), area.width - 120)
  win.rect.y = clamp(y, 0, area.height - 28)
}

export function resizeWindow(id: string, rect: Rect): void {
  const win = find(id)
  if (!win || win.maximized) return
  const area = workArea()
  const width = clamp(rect.width, MIN_WIDTH, area.width)
  const height = clamp(rect.height, MIN_HEIGHT, area.height)
  win.rect.width = width
  win.rect.height = height
  win.rect.x = clamp(rect.x, -(width - 120), area.width - 120)
  win.rect.y = clamp(rect.y, 0, area.height - 28)
}

export function taskbarActivate(id: string): void {
  const win = find(id)
  if (!win) return
  if (win.minimized) {
    win.minimized = false
    focus(id)
  } else if (windowsState.activeId === id) {
    win.minimized = true
    recomputeActive()
  } else {
    focus(id)
  }
}

export function initWindows(): void {
  if (initialized) return
  initialized = true

  const area = workArea()
  const width = Math.min(680, area.width - 24)
  const height = Math.min(520, area.height - 24)
  const win: AppWindow = {
    id: 'explorer',
    kind: 'explorer',
    title: '洋子数码广场 | Noctoid Blog',
    rect: {
      x: Math.max(8, Math.round((area.width - width) / 2)),
      y: Math.max(8, Math.round((area.height - height) / 2)),
      width,
      height,
    },
    z: 0,
    minimized: false,
    maximized: false,
    restoreRect: null,
  }
  windowsState.windows.push(win)
  focus(win.id)
}
