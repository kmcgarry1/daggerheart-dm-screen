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
        placeholder="YouTube URL (https://...)"
        class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        @input="updateWidget('url', ($event.target as HTMLInputElement).value)"
      />
      <label class="inline-flex items-center gap-2 text-sm text-[color:var(--dh-panel-text)]">
        <input
          type="checkbox"
          :checked="widget.background"
          @change="updateWidget('background', ($event.target as HTMLInputElement).checked)"
        />
        Use as background
      </label>
    </div>
    <div v-if="widget.url" class="aspect-video w-full overflow-hidden rounded-xl border border-[color:var(--dh-panel-border)] bg-black">
      <iframe
        :src="embedSrc"
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="h-full w-full"
      ></iframe>
    </div>
    <p v-else class="text-sm text-[color:var(--dh-panel-muted)]">Paste a YouTube link to embed.</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { computeYouTubeEmbed } from '../../../utils/embeds'
import type { YoutubeWidget } from '../../../widgets/types'
import type { WidgetUpdateKey } from '../../../widgets/updateHandlers'

const props = defineProps<{ widget: YoutubeWidget }>()

const emit = defineEmits<{ (e: 'update', payload: { key: WidgetUpdateKey; value: string | boolean }): void }>()

const updateWidget = (key: WidgetUpdateKey, value: string | boolean) => {
  emit('update', { key, value })
}

const embedSrc = computed(() => computeYouTubeEmbed(props.widget.url) || undefined)
</script>
