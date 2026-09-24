<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getManifest, type PostMeta } from '@/lib/content'
import { openArticle } from '@/lib/windows'
import FileIcon from '@/components/FileIcon.vue'

const posts = ref<PostMeta[]>([])
const loading = ref(true)
const error = ref('')
const selectedSlug = ref<string | null>(null)

onMounted(async () => {
  try {
    posts.value = (await getManifest()).posts
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

function select(slug: string) {
  selectedSlug.value = slug
}

function clearSelection() {
  selectedSlug.value = null
}

function open(slug: string) {
  const post = posts.value.find((p) => p.slug === slug)
  if (post) openArticle(post.slug, post.title)
}

function tileTitle(post: PostMeta): string {
  return [post.title, post.date, post.summary].filter((s) => s !== '').join(' — ')
}

function openGitHub() {
  window.open('https://github.com/noctoid', '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="explorer-window">
    <div class="field-row">
      <button @click="openGitHub">GitHub</button>
    </div>

    <p v-if="loading">Loading articles…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <p v-else-if="posts.length === 0">
      No articles yet. Drop a <code>.md</code> file into <code>content/</code>.
    </p>

    <div v-else class="sunken-panel explorer-pane" @click="clearSelection">
      <div class="explorer-grid">
        <button
          v-for="post in posts"
          :key="post.slug"
          type="button"
          class="file-tile"
          :class="{ selected: selectedSlug === post.slug }"
          :title="tileTitle(post)"
          @click.stop="select(post.slug)"
          @dblclick.stop="open(post.slug)"
          @keydown.enter.prevent="open(post.slug)"
        >
          <FileIcon class="file-icon" />
          <span class="file-name">{{ post.title }}</span>
        </button>
      </div>
    </div>

    <div class="status-bar">
      <p class="status-bar-field">
        {{ posts.length }} object(s)<template v-if="selectedSlug"> · 1 selected</template>
      </p>
    </div>
  </div>
</template>
