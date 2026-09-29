<script setup lang="ts">
import { openExplorer, openPhotography, windowsState } from '@/lib/windows'
import WindowFrame from '@/components/WindowFrame.vue'
import Taskbar from '@/components/Taskbar.vue'
import WordPad from '@/components/WordPad.vue'
import ArticleListView from '@/views/ArticleListView.vue'
import PhotographyView from '@/views/PhotographyView.vue'
import PhotobookView from '@/views/PhotobookView.vue'
import DesktopIcon from '@/components/DesktopIcon.vue'
import SuitcaseIcon from '@/components/SuitcaseIcon.vue'
import CameraIcon from '@/components/CameraIcon.vue'
</script>

<template>
  <div class="crt-monitor">
    <div class="crt-screen">
      <div class="desktop">
        <div class="desktop-icons">
          <DesktopIcon label="Blogs" @open="openExplorer">
            <SuitcaseIcon class="desktop-icon-img" />
          </DesktopIcon>
          <DesktopIcon label="Photography" @open="openPhotography">
            <CameraIcon class="desktop-icon-img" />
          </DesktopIcon>
        </div>

        <WindowFrame v-for="win in windowsState.windows" :key="win.id" :win="win">
          <ArticleListView v-if="win.kind === 'explorer'" />
          <WordPad v-else-if="win.kind === 'article'" :slug="win.slug!" />
          <PhotographyView v-else-if="win.kind === 'photos'" />
          <PhotobookView v-else-if="win.kind === 'photobook'" :slug="win.slug!" />
        </WindowFrame>

        <Taskbar />
      </div>
    </div>
  </div>
</template>
