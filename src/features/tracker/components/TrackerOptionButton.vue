<template>
  <button
    type="button"
    :class="[
      'group relative flex cursor-pointer flex-none items-center justify-center rounded-full border-2 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
      sizeClasses,
      active ? 'shadow-[var(--tracker-shadow-active,0_0_0_0)]' : 'shadow-[var(--tracker-shadow-base,0_0_0_0)]',
    ]"
    :style="styleVars"
    @click="$emit('activate')"
  >
    <span
      v-if="burst"
      class="pointer-events-none absolute inset-0 rounded-full"
      :style="{
        background: burstGradient,
        animation: 'tracker-burst 0.55s ease-out forwards',
      }"
    ></span>
    <span class="relative flex h-full w-full items-center justify-center">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { TrackerButtonPalette } from '../types'

const props = withDefaults(
  defineProps<{
    active: boolean
    burst: boolean
    palette: TrackerButtonPalette
    burstGradient: string
    sizeClasses?: string
  }>(),
  {
    sizeClasses: 'h-[clamp(2.8rem,_4vw,_3.4rem)] w-[clamp(2.8rem,_4vw,_3.4rem)]',
  },
)

defineEmits<{
  (e: 'activate'): void
}>()

const mergedActiveState = computed(() => ({
  ...props.palette.base,
  ...props.palette.active,
}))

const currentState = computed(() => (props.active ? mergedActiveState.value : props.palette.base))

const styleVars = computed(() => {
  const base = props.palette.base
  const state = currentState.value
  return {
    background: state.background,
    borderColor: state.border,
    color: state.color,
    boxShadow: state.shadow ?? 'none',
    '--tracker-icon-accent': state.iconAccent ?? base.iconAccent ?? state.color,
    '--tracker-icon-fill': state.iconFill ?? base.iconFill ?? 'rgba(255,255,255,0.9)',
    '--tracker-hover-border': base.hoverBorder ?? base.border,
    '--tracker-hover-shadow': base.hoverShadow ?? state.shadow ?? 'none',
    '--tracker-shadow-base': base.shadow ?? 'none',
    '--tracker-shadow-active': mergedActiveState.value.shadow ?? base.shadow ?? 'none',
  } as Record<string, string>
})

const sizeClasses = computed(() => props.sizeClasses)
</script>

<style scoped>
button:hover {
  border-color: var(--tracker-hover-border);
  box-shadow: var(--tracker-hover-shadow);
  transform: translateY(-4px);
}

@keyframes tracker-burst {
  0% {
    opacity: 0.9;
    transform: scale(0.4);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
  70% {
    opacity: 0.6;
    transform: scale(1.35);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
