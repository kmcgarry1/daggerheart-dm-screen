<template>
  <p class="text-sm font-semibold text-[color:var(--dh-panel-muted)]" :aria-live="ariaLive">
    {{ remaining }} steps remaining - {{ completed }} complete
  </p>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    remaining: number
    completed: number
    ariaLive?: 'polite' | 'assertive' | 'off'
  }>(),
  {
    ariaLive: 'polite',
  },
)

const ariaLive = computed(() => props.ariaLive)
</script>
