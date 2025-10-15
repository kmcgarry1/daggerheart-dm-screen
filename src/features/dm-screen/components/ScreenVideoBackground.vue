<template>
  <div class="dh-video-bg" aria-hidden="true">
    <iframe
      v-if="src"
      :src="autoplaySrc"
      title="Background video"
      allow="autoplay; fullscreen; picture-in-picture"
      frameborder="0"
      class="dh-video-bg__iframe"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  src: string | null
  muted?: boolean
}>()

const autoplaySrc = computed(() => {
  if (!props.src) return ''
  const url = new URL(props.src)
  // Ensure background-friendly params for YouTube embeds
  url.searchParams.set('autoplay', '1')
  url.searchParams.set('mute', props.muted ? '1' : '0')
  url.searchParams.set('controls', '0')
  url.searchParams.set('loop', '1')
  url.searchParams.set('playsinline', '1')
  url.searchParams.set('modestbranding', '1')
  url.searchParams.set('rel', '0')
  return url.toString()
})
</script>

<style scoped>
.dh-video-bg {
  position: fixed;
  inset: 0;
  z-index: 0; /* Below app chrome; ScreenBackground should also be behind content */
  pointer-events: none;
  overflow: hidden;
}
.dh-video-bg__iframe {
  width: 100vw;
  height: 100vh;
}
</style>

