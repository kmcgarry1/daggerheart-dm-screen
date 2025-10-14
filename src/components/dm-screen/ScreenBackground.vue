<template>
  <div class="absolute inset-0 -z-20 overflow-hidden">
    <div class="absolute inset-0 h-full w-full bg-cover bg-center" :style="{ background: gradient }"></div>
    <TransitionGroup name="dh-bg-fade" tag="div" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url('${layer.url}')` }"
      ></div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type BackgroundLayer = {
  id: string
  url: string
}

const props = defineProps<{
  layers: BackgroundLayer[]
  baseGradient?: string
}>()

const gradient = computed(() => props.baseGradient ?? 'var(--dh-backdrop)')
</script>
