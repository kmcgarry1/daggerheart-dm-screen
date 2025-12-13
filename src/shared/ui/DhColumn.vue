<template>
  <div class="dh-column" :style="{ width: normalizedWidth }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  width?: string | number
}>()

const normalizedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width ?? 'auto',
)
</script>

<style scoped>
.dh-column {
  display: flex;
  flex-direction: column;
}
</style>
