<template>
  <TrackerControl
    v-model="momentum"
    :options="options"
    :palette="palette"
    title="Momentum"
    description="Track party morale or tempo."
    track-label="Momentum tracker buttons"
    :card-variant="{ width: '100', height: '100' }"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import TrackerControl from '../tracker/TrackerControl.vue'
import { emberPalette } from '../tracker/palettes'
import { FlameIcon } from '../tracker/icons'

const steps = 8
const momentum = ref(0)
const palette = emberPalette

const options = computed(() =>
  Array.from({ length: steps }, (_, index) => {
    const level = index + 1
    return {
      value: level,
      label: `Set momentum to ${level}`,
      icon: FlameIcon,
    }
  }),
)
</script>
