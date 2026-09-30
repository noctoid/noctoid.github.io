<script setup lang="ts">
import { openArticle, openBrowser, openExplorer, openMyComputer, openPhotography } from '@/lib/windows'

const emit = defineEmits<{
  close: []
  shutdown: []
}>()

function openBlogs() {
  openExplorer()
  emit('close')
}

function openPhotos() {
  openPhotography()
  emit('close')
}

function openComputer() {
  openMyComputer()
  emit('close')
}

function openBrowserMenu() {
  openBrowser()
  emit('close')
}

function openAbout() {
  openArticle('about', 'About Me')
  emit('close')
}

function openGitHub() {
  window.open('https://github.com/noctoid', '_blank', 'noopener,noreferrer')
  emit('close')
}

function shutdownComputer() {
  emit('shutdown')
  emit('close')
}
</script>

<template>
  <div class="start-menu" role="menu">
    <div class="start-menu-banner">
      <span class="start-menu-banner-text">Noctoid</span>
    </div>
    <div class="start-menu-list">
      <button type="button" role="menuitem" class="start-menu-item" @click="openComputer">My Computer</button>
      <button type="button" role="menuitem" class="start-menu-item" @click="openBrowserMenu">Internet Explorer</button>
      <button type="button" role="menuitem" class="start-menu-item" @click="openBlogs">Blogs</button>
      <button type="button" role="menuitem" class="start-menu-item" @click="openPhotos">Photography</button>
      <button type="button" role="menuitem" class="start-menu-item" @click="openAbout">About Me</button>
      <button type="button" role="menuitem" class="start-menu-item" @click="openGitHub">My Github Page</button>
      <div class="start-menu-sep"></div>
      <button type="button" role="menuitem" class="start-menu-item" @click="shutdownComputer">Shutdown Computer</button>
    </div>
  </div>
</template>
