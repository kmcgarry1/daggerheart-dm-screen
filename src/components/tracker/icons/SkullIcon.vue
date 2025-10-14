<template>
  <svg
    :class="['h-full w-full', props.class]"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4C9.92487 4 5 8.92487 5 15C5 18.533 6.63333 20.9333 9.9 22.2L10 26C10 27.1046 10.8954 28 12 28H14V25C14 24.4477 14.4477 24 15 24H17C17.5523 24 18 24.4477 18 25V28H20C21.1046 28 22 27.1046 22 26L22.1 22.2C25.3667 20.9333 27 18.533 27 15C27 8.92487 22.0751 4 16 4Z"
      :style="{
        fill: 'var(--tracker-icon-fill, rgba(255, 255, 255, 0.85))',
        stroke: 'currentColor',
        strokeWidth: 1.5,
      }"
    />
    <path
      d="M12.5 15C13.3284 15 14 14.3284 14 13.5C14 12.6716 13.3284 12 12.5 12C11.6716 12 11 12.6716 11 13.5C11 14.3284 11.6716 15 12.5 15Z"
      :style="{ fill: 'var(--tracker-icon-accent, currentColor)' }"
    />
    <path
      d="M19.5 15C20.3284 15 21 14.3284 21 13.5C21 12.6716 20.3284 12 19.5 12C18.6716 12 18 12.6716 18 13.5C18 14.3284 18.6716 15 19.5 15Z"
      :style="{ fill: 'var(--tracker-icon-accent, currentColor)' }"
    />
    <path
      d="M16 19C17.1046 19 18 18.1046 18 17H14C14 18.1046 14.8954 19 16 19Z"
      :style="{ fill: 'var(--tracker-icon-accent, currentColor)' }"
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
