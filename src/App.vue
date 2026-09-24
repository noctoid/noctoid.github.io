<script setup lang="ts">
import { windowsState } from '@/lib/windows'
import WindowFrame from '@/components/WindowFrame.vue'
import Taskbar from '@/components/Taskbar.vue'
import WordPad from '@/components/WordPad.vue'
import ArticleListView from '@/views/ArticleListView.vue'
import DesktopIcon from '@/components/DesktopIcon.vue'
</script>

<template>
  <div class="crt-monitor">
    <div class="crt-screen">
      <div class="desktop">
        <DesktopIcon />

        <WindowFrame
          v-for="win in windowsState.windows"
          :key="win.id"
          :win="win"
        >
          <ArticleListView v-if="win.kind === 'explorer'" />
          <WordPad v-else :slug="win.slug!" />
        </WindowFrame>

        <Taskbar />
      </div>
    </div>
  </div>
</template>
