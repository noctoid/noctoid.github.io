<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { contentAssetUrl, getTree, type FileNode } from '@/lib/content'
import { openArticle, openImage } from '@/lib/windows'
import DriveIcon from '@/components/DriveIcon.vue'
import FolderIcon from '@/components/FolderIcon.vue'
import FileIcon from '@/components/FileIcon.vue'

type Location = { type: 'computer' } | { type: 'dir'; segments: string[] }

const tree = ref<FileNode[]>([])
const loading = ref(true)
const error = ref('')
const history = ref<Location[]>([{ type: 'computer' }])
const selected = ref<string | null>(null)

const current = computed(() => history.value[history.value.length - 1])

onMounted(async () => {
  try {
    tree.value = await getTree()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

const address = computed(() => {
  const loc = current.value
  return loc.type === 'computer' ? 'My Computer' : 'C:\\' + loc.segments.join('\\')
})

function resolveDir(segments: string[]): FileNode[] {
  let nodes = tree.value
  for (const seg of segments) {
    const next = nodes.find((n) => n.type === 'dir' && n.name === seg)
    if (!next) return []
    nodes = next.children ?? []
  }
  return nodes
}

const items = computed<FileNode[]>(() => {
  const loc = current.value
  return loc.type === 'computer' ? [] : resolveDir(loc.segments)
})

function navigate(loc: Location) {
  history.value.push(loc)
  selected.value = null
}

function currentSegments(): string[] {
  const loc = current.value
  return loc.type === 'dir' ? [...loc.segments] : []
}

function openNode(node: FileNode) {
  if (node.type === 'dir') {
    navigate({ type: 'dir', segments: [...currentSegments(), node.name] })
  } else {
    openFile(node)
  }
}

function openFile(node: FileNode) {
  const ext = node.ext ?? ''
  if (ext === '.md' && node.path.startsWith('blogs/')) {
    const slug = node.name.replace(/\.md$/i, '')
    openArticle(slug, slug)
  } else if (/\.(jpe?g|png|gif|webp|bmp)$/i.test(ext)) {
    openImage(contentAssetUrl(node.path), node.name)
  }
}

function openDrive() {
  navigate({ type: 'dir', segments: [] })
}

function back() {
  if (history.value.length > 1) history.value.pop()
  selected.value = null
}

function up() {
  const loc = current.value
  if (loc.type === 'computer') return
  if (loc.segments.length === 0) {
    navigate({ type: 'computer' })
  } else {
    navigate({ type: 'dir', segments: loc.segments.slice(0, -1) })
  }
}

function select(name: string) {
  selected.value = name
}

function clearSelection() {
  selected.value = null
}
</script>

<template>
  <div class="explorer-window">
    <div class="explorer-toolbar">
      <button type="button" :disabled="history.length <= 1" @click="back" title="Back">Back</button>
      <button type="button" :disabled="current.type === 'computer'" @click="up" title="Up">Up</button>
      <div class="address-bar">
        <span class="address-label">Address</span>
        <input type="text" readonly :value="address" />
      </div>
    </div>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else class="sunken-panel explorer-pane" @click="clearSelection">
      <div class="explorer-grid">
        <template v-if="current.type === 'computer'">
          <button
            type="button"
            class="file-tile"
            :class="{ selected: selected === 'C:' }"
            :title="'Local Disk (C:)'"
            @click.stop="select('C:')"
            @dblclick.stop="openDrive"
          >
            <DriveIcon class="file-icon" />
            <span class="file-name">Local Disk (C:)</span>
          </button>
        </template>
        <template v-else>
          <button
            v-for="node in items"
            :key="node.path"
            type="button"
            class="file-tile"
            :class="{ selected: selected === node.name }"
            :title="node.name"
            @click.stop="select(node.name)"
            @dblclick.stop="openNode(node)"
          >
            <FolderIcon v-if="node.type === 'dir'" class="file-icon" />
            <FileIcon v-else class="file-icon" />
            <span class="file-name">{{ node.name }}</span>
          </button>
        </template>
      </div>
    </div>

    <div class="status-bar">
      <p class="status-bar-field">
        <template v-if="current.type === 'computer'">1 object(s)</template>
        <template v-else>{{ items.length }} object(s)</template>
        <template v-if="selected"> · 1 selected</template>
      </p>
    </div>
  </div>
</template>
