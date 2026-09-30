<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <div class="image-viewer">
    <img :src="slug" alt="" draggable="false" />
  </div>
</template>
