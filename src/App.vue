<script setup lang="ts">
import { ref } from 'vue'
import { openBrowser, openExplorer, openMyComputer, openPhotography, windowsState } from '@/lib/windows'
import WindowFrame from '@/components/WindowFrame.vue'
import Taskbar from '@/components/Taskbar.vue'
import WordPad from '@/components/WordPad.vue'
import ArticleListView from '@/views/ArticleListView.vue'
import PhotographyView from '@/views/PhotographyView.vue'
import PhotobookView from '@/views/PhotobookView.vue'
import FileExplorerView from '@/views/FileExplorerView.vue'
import ImageViewerView from '@/views/ImageViewerView.vue'
import BrowserView from '@/views/BrowserView.vue'
import DesktopIcon from '@/components/DesktopIcon.vue'
import SuitcaseIcon from '@/components/SuitcaseIcon.vue'
import CameraIcon from '@/components/CameraIcon.vue'
import ComputerIcon from '@/components/ComputerIcon.vue'
import BrowserIcon from '@/components/BrowserIcon.vue'

const selectedIcon = ref<string | null>(null)

function selectIcon(name: string) {
  selectedIcon.value = name
}
</script>

<template>
  <div class="crt-monitor">
    <div class="crt-screen">
      <div class="desktop">
        <div class="desktop-icons">
          <DesktopIcon
            label="My Computer"
            :selected="selectedIcon === 'My Computer'"
            @select="selectIcon('My Computer')"
            @open="openMyComputer"
          >
            <ComputerIcon class="desktop-icon-img" />
          </DesktopIcon>
          <DesktopIcon
            label="Internet Explorer"
            :selected="selectedIcon === 'Internet Explorer'"
            @select="selectIcon('Internet Explorer')"
            @open="openBrowser"
          >
            <BrowserIcon class="desktop-icon-img" />
          </DesktopIcon>
          <DesktopIcon
            label="Blogs"
            :selected="selectedIcon === 'Blogs'"
            @select="selectIcon('Blogs')"
            @open="openExplorer"
          >
            <SuitcaseIcon class="desktop-icon-img" />
          </DesktopIcon>
          <DesktopIcon
            label="Photography"
            :selected="selectedIcon === 'Photography'"
            @select="selectIcon('Photography')"
            @open="openPhotography"
          >
            <CameraIcon class="desktop-icon-img" />
          </DesktopIcon>
        </div>

        <WindowFrame v-for="win in windowsState.windows" :key="win.id" :win="win">
          <ArticleListView v-if="win.kind === 'explorer'" />
          <WordPad v-else-if="win.kind === 'article'" :slug="win.slug!" />
          <PhotographyView v-else-if="win.kind === 'photos'" />
          <PhotobookView v-else-if="win.kind === 'photobook'" :slug="win.slug!" />
          <FileExplorerView v-else-if="win.kind === 'computer'" />
          <ImageViewerView v-else-if="win.kind === 'image'" :slug="win.slug!" />
          <BrowserView v-else-if="win.kind === 'browser'" />
        </WindowFrame>

        <Taskbar />
      </div>
    </div>
  </div>
</template>
