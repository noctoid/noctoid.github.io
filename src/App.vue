<script setup lang="ts">
import { onMounted } from 'vue'
import { initWindows, windowsState } from '@/lib/windows'
import WindowFrame from '@/components/WindowFrame.vue'
import Taskbar from '@/components/Taskbar.vue'
import WordPad from '@/components/WordPad.vue'
import ArticleListView from '@/views/ArticleListView.vue'

onMounted(() => initWindows())
</script>

<template>
  <div class="desktop">
    <WindowFrame
      v-for="win in windowsState.windows"
      :key="win.id"
      :win="win"
      :closable="win.kind !== 'explorer'"
    >
      <ArticleListView v-if="win.kind === 'explorer'" />
      <WordPad v-else :slug="win.slug!" />
    </WindowFrame>

    <Taskbar />
  </div>
</template>
