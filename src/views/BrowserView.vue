<script setup lang="ts">
import { ref } from 'vue'

const address = ref('')
const frameSrc = ref('about:blank')
const frameKey = ref(0)
const history = ref<string[]>([])
const historyIndex = ref(-1)
const status = ref('Done')

function normalizeUrl(input: string): string {
  const t = input.trim()
  if (!t) return ''
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

function load(url: string) {
  frameSrc.value = url
  address.value = url
  status.value = 'Opening page…'
}

function push(url: string) {
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(url)
  historyIndex.value = history.value.length - 1
}

function go() {
  const url = normalizeUrl(address.value)
  if (!url) return
  push(url)
  load(url)
}

function back() {
  if (historyIndex.value <= 0) return
  historyIndex.value -= 1
  load(history.value[historyIndex.value])
}

function forward() {
  if (historyIndex.value >= history.value.length - 1) return
  historyIndex.value += 1
  load(history.value[historyIndex.value])
}

function refresh() {
  frameKey.value += 1
}

function home() {
  address.value = ''
  frameSrc.value = 'about:blank'
  frameKey.value += 1
  status.value = 'Done'
}

function onFrameLoad() {
  status.value = 'Done'
}
</script>

<template>
  <div class="browser">
    <div class="menu-bar" role="menubar">
      <button type="button" tabindex="-1">File</button>
      <button type="button" tabindex="-1">Edit</button>
      <button type="button" tabindex="-1">View</button>
      <button type="button" tabindex="-1">Go</button>
      <button type="button" tabindex="-1">Favorites</button>
      <button type="button" tabindex="-1">Help</button>
    </div>

    <div class="browser-toolbar">
      <button type="button" :disabled="historyIndex <= 0" @click="back">Back</button>
      <button type="button" :disabled="historyIndex >= history.length - 1" @click="forward">Forward</button>
      <span class="sep"></span>
      <button type="button" @click="refresh">Refresh</button>
      <button type="button" @click="home">Home</button>
    </div>

    <div class="browser-address">
      <span class="browser-address-label">Address</span>
      <input type="text" v-model="address" placeholder="Type a URL and press Enter" @keydown.enter="go" />
      <button type="button" @click="go">Go</button>
    </div>

    <iframe :key="frameKey" :src="frameSrc" class="browser-frame" title="Browser" @load="onFrameLoad"></iframe>

    <div class="status-bar">
      <p class="status-bar-field">{{ status }}</p>
    </div>
  </div>
</template>
