<template>
  <div>
    <div class="flex flex-wrap items-center justify-end gap-2">
      <RouterLink to="/widget-library" class="dh-toggle">
        Widget Library
      </RouterLink>
      <button type="button" class="dh-toggle" @click="$emit('toggle:dark')">
        <span aria-hidden="true">{{ darkMode ? '🌙' : '☀️' }}</span>
      </button>
      <button type="button" class="dh-toggle" @click="$emit('toggle:sidebar')">
        <span>{{ sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar' }}</span>
      </button>
      <button type="button" class="dh-toggle" @click="$emit('toggle:widgets')">
        <span>{{ widgetsCollapsed ? 'Show Widgets' : 'Hide Widgets' }}</span>
      </button>
    </div>

    <fear-tracker
      class="mt-4"
      :value="fearValue"
      @update:value="(value) => $emit('update:fear', value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import FearTracker from '../fear/FearTracker.vue'

defineProps<{
  darkMode: boolean
  sidebarCollapsed: boolean
  widgetsCollapsed: boolean
  fearValue: number
}>()

defineEmits<{
  (e: 'toggle:dark'): void
  (e: 'toggle:sidebar'): void
  (e: 'toggle:widgets'): void
  (e: 'update:fear', value: number): void
}>()
</script>
