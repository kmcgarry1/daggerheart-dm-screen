<template>
  <svg
    :class="['h-full w-full', props.class]"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 6L6 12L12 26H20L26 12L16 6Z"
      :style="{
        fill: 'var(--tracker-icon-fill, rgba(255, 255, 255, 0.85))',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinejoin: 'round',
      }"
    />
    <path
      d="M16 6L12 12L16 26L20 12L16 6Z"
      :style="{
        fill: 'var(--tracker-icon-accent, currentColor)',
        opacity: 0.85,
      }"
    />
  </svg>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    class?: string
  }>(),
  {
    class: '',
  },
)
</script>
