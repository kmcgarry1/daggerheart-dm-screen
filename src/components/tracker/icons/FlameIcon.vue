<template>
  <svg
    :class="['h-full w-full', props.class]"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 4C16 4 8 10 8 16C8 21.5228 11.5817 26 16 26C20.4183 26 24 21.5228 24 16C24 12 21 8 18.5 6.5C17.5 8.5 18 11 16 12.5C14.5 13.6667 13.8 11.6 14 10C11 12 12 17 15 19C15.7754 19.5816 14.5 22 12.5 20C11 18.5 11 16 11 16"
      :style="{
        fill: 'var(--tracker-icon-fill, rgba(255, 255, 255, 0.85))',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }"
    />
    <path
      d="M15.5 14C14 16.5 15 19 17 20.5"
      :style="{
        stroke: 'var(--tracker-icon-accent, currentColor)',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
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
