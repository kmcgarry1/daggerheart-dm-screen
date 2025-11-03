<template>
  <div class="space-y-4">
    <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <button
        type="button"
        class="dh-toggle dh-toggle--icon"
        title="Toggle dark mode"
        :aria-pressed="darkMode"
        @click="$emit('toggle:dark')"
      >
        <span class="sr-only">Toggle dark mode</span>
        <svg v-if="darkMode" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z"
          />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"></circle>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-7.364-.707.707M7.343 16.657l-.707.707m12.728 0-.707-.707M7.343 7.343l-.707-.707"
          />
        </svg>
      </button>

      <button
        type="button"
        class="dh-toggle dh-toggle--icon"
        title="Toggle ambient motion"
        :aria-pressed="reduceMotion"
        @click="$emit('toggle:motion')"
      >
        <span class="sr-only">Toggle ambient motion</span>
        <svg v-if="reduceMotion" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6v12m6-12v12" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 7h5l2 5h4l2-3h3"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16" />
        </svg>
      </button>

      <button
        type="button"
        class="dh-toggle dh-toggle--icon"
        title="Toggle sidebar"
        :aria-pressed="!sidebarCollapsed"
        @click="$emit('toggle:sidebar')"
      >
        <span class="sr-only">Toggle sidebar</span>
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3.75" y="5" width="16.5" height="14" rx="2"></rect>
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 5v14" />
        </svg>
      </button>

      <button
        type="button"
        class="dh-toggle dh-toggle--icon"
        title="Toggle widgets"
        :aria-pressed="!widgetsCollapsed"
        @click="$emit('toggle:widgets')"
      >
        <span class="sr-only">Toggle widgets</span>
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="4" y="4" width="16" height="16" rx="3"></rect>
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16M12 4v16" />
        </svg>
      </button>
    </div>

    <fear-tracker :value="fearValue" @update:value="(value) => $emit('update:fear', value)" />
  </div>
</template>

<script lang="ts" setup>
import { FearTracker } from '@/features/fear'

defineProps<{
  darkMode: boolean
  reduceMotion: boolean
  sidebarCollapsed: boolean
  widgetsCollapsed: boolean
  fearValue: number
}>()

defineEmits<{
  (e: 'toggle:dark'): void
  (e: 'toggle:motion'): void
  (e: 'toggle:sidebar'): void
  (e: 'toggle:widgets'): void
  (e: 'update:fear', value: number): void
}>()
</script>
