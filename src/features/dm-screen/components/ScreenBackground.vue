<template>
  <div class="absolute inset-0 -z-20 overflow-hidden">
    <div
      class="dh-background-gradient absolute inset-0 h-full w-full bg-cover bg-center"
      :style="{ background: gradient }"
    ></div>
    <TransitionGroup name="dh-bg-fade" tag="div" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="dh-background-layer absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        :style="layerStyle(layer)"
      ></div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { BackgroundLayer } from '@/features/dm-screen/composables/useBackgrounds'

const props = defineProps<{
  layers: BackgroundLayer[]
  baseGradient?: string
}>()

const gradient = computed(() => props.baseGradient ?? 'var(--dh-backdrop)')

const formatPercent = (value: number) => {
  const normalized = Math.abs(value) < 0.005 ? 0 : value
  return `${normalized.toFixed(2)}%`
}

const layerStyle = (layer: BackgroundLayer): Record<string, string> => ({
  backgroundImage: `url('${layer.url}')`,
  '--dh-pan-from-x': formatPercent(layer.panFromX),
  '--dh-pan-from-y': formatPercent(layer.panFromY),
  '--dh-pan-to-x': formatPercent(layer.panToX),
  '--dh-pan-to-y': formatPercent(layer.panToY),
  '--dh-pan-duration': `${Math.round(layer.durationMs)}ms`,
  '--dh-pan-from-scale': layer.scaleFrom.toString(),
  '--dh-pan-to-scale': layer.scaleTo.toString(),
})
</script>
