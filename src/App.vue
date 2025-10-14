<script setup lang="ts">
import DMScreen from './components/DMScreen.vue';
</script>

<template>
  <DMScreen />
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

:deep(.dm-screen-root) {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

</style>