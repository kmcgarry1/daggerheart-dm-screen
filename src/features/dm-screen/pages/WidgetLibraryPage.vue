<template>
  <div class="min-h-screen bg-[var(--dh-bg)] px-4 py-8 text-[color:var(--dh-panel-text)] transition-colors duration-500">
    <main class="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header class="flex flex-col gap-3">
        <RouterLink
          to="/"
          class="self-start dh-toggle gap-2 px-4 py-2 text-sm"
          aria-label="Return to DM screen"
        >
          ← Back to DM Screen
        </RouterLink>
        <div class="space-y-2">
          <h1 class="text-2xl font-semibold">Widget Library</h1>
          <p class="text-sm text-[color:var(--dh-panel-muted)]">
            Experiment with tracker presets and craft countdown cards that slot into your DM screen.
          </p>
        </div>
      </header>

      <WidgetLibraryCountdown />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

import WidgetLibraryCountdown from '@/features/dm-screen/components/WidgetLibraryCountdown.vue'
</script>
