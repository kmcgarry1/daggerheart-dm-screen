<template>
  <div class="flex flex-col gap-3">
    <div v-if="widget.editing" class="flex flex-col gap-2">
      <input
        :value="widget.title"
        type="text"
        placeholder="Title (optional)"
        class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        @input="updateWidget('title', ($event.target as HTMLInputElement).value)"
      />
      <input
        :value="widget.url"
        type="url"
        placeholder="Spotify URL (track/album/playlist)"
        class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        @input="updateWidget('url', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div v-if="widget.url" class="w-full overflow-hidden rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)]">
      <iframe
        :src="embedSrc"
        width="100%"
        height="152"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
    <p v-else class="text-sm text-[color:var(--dh-panel-muted)]">Paste a Spotify link to embed.</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { computeSpotifyEmbed } from '../../../utils/embeds'
import type { SpotifyWidget } from '../../../widgets/types'
import type { WidgetUpdateKey } from '../../../widgets/updateHandlers'

const props = defineProps<{ widget: SpotifyWidget }>()

const emit = defineEmits<{ (e: 'update', payload: { key: WidgetUpdateKey; value: string | boolean }): void }>()

const updateWidget = (key: WidgetUpdateKey, value: string | boolean) => {
  emit('update', { key, value })
}

const embedSrc = computed(() => computeSpotifyEmbed(props.widget.url) || undefined)
</script>
