<template>
  <section class="flex flex-col gap-6" aria-label="Dashboard workspace">
    <Transition
      enter-active-class="transition duration-400 transform"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
      mode="out-in"
    >
      <div
        v-if="!collapsed"
        key="workspace-grid"
        class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <dh-card
          v-for="widget in visibleWidgets"
          :key="widget.id"
          :class="[
            'relative flex flex-col gap-4 transition-all duration-200',
            spanClassForSize(widget.size),
            widget.id === activeWidgetId
              ? 'ring-2 ring-violet-400/70 shadow-2xl'
              : 'hover:-translate-y-1 hover:shadow-xl',
            widget.hidden ? 'opacity-80' : '',
          ]"
        >
          <template #title>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <input
                v-if="widget.editing && widget.type === 'note'"
                :id="`${widget.id}-title`"
                :value="widget.title"
                type="text"
                placeholder="Widget title"
                class="w-full flex-1 rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                @input="updateWidget(widget.id, 'title', ($event.target as HTMLInputElement).value)"
              />
              <span v-else class="text-base font-semibold">
                {{ widget.title || (widget.type === 'countdown' ? 'Countdown' : 'Untitled Widget') }}
              </span>
              <div class="flex items-center gap-2">
                
                <select
                  v-if="widget.editing"
                  :value="widget.size"
                  class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--dh-panel-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @change="updateWidget(widget.id, 'size', ($event.target as HTMLSelectElement).value)"
                >
                  <option
                    v-for="option in sizeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <button
                  type="button"
                  class="dh-toggle px-3 py-2"
                  @click="$emit('toggle-edit', widget.id)"
                  :aria-label="widget.editing ? 'Save widget' : 'Edit widget'"
                >
                  {{ widget.editing ? 'Save' : 'Edit' }}
                </button>
                <button
                  type="button"
                  class="dh-toggle border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-rose-400 hover:border-rose-300"
                  @click="$emit('remove-widget', widget.id)"
                  aria-label="Delete widget"
                >
                  Delete
                </button>
                <button
                  v-if="!widget.hidden"
                  type="button"
                  class="dh-toggle px-2 py-1 text-xs"
                  @click="updateWidget(widget.id, 'hidden', true)"
                  aria-label="Minimize widget"
                  title="Minimize"
                >
                  —
                </button>
                <button
                  v-else
                  type="button"
                  class="dh-toggle px-2 py-1 text-xs"
                  @click="updateWidget(widget.id, 'hidden', false)"
                  aria-label="Restore widget"
                  title="Restore"
                >
                  ◼
                </button>
              </div>
            </div>
          </template>
          <template #body>
            <div v-if="widget.hidden" class="flex items-center gap-3 text-sm text-[color:var(--dh-panel-muted)]">
              <span class="inline-block h-2 w-2 rounded-full bg-[color:var(--dh-panel-muted)]"></span>
              Minimized — use dock or Restore to expand
            </div>
            <textarea
              v-if="widget.editing && widget.type === 'note'"
              :value="widget.body"
              rows="4"
              placeholder="Notes, trackers, reminders..."
              class="w-full rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-3 text-sm text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              @input="updateWidget(widget.id, 'body', ($event.target as HTMLTextAreaElement).value)"
            ></textarea>
            <p v-else-if="widget.type === 'note'" class="text-sm leading-relaxed text-[color:var(--dh-panel-muted)]">
              {{ widget.body || 'Add notes or quick references for your session.' }}
            </p>
            <CountdownWidgetCard
              v-else-if="!widget.hidden && widget.type === 'countdown'"
              :config="widget.countdown"
              :editing="widget.editing"
              @update:config="updateCountdown(widget.id, $event)"
            />
            <div v-else-if="!widget.hidden && widget.type === 'youtube'" class="flex flex-col gap-3">
              <div v-if="widget.editing" class="flex flex-col gap-2">
                <input
                  :value="widget.title"
                  type="text"
                  placeholder="Title (optional)"
                  class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @input="updateWidget(widget.id, 'title', ($event.target as HTMLInputElement).value)"
                />
                <input
                  :value="widget.url"
                  type="url"
                  placeholder="YouTube URL (https://...)"
                  class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @input="updateWidget(widget.id, 'url', ($event.target as HTMLInputElement).value)"
                />
                <label class="inline-flex items-center gap-2 text-sm text-[color:var(--dh-panel-text)]">
                  <input
                    type="checkbox"
                    :checked="widget.background"
                    @change="updateWidget(widget.id, 'background', ($event.target as HTMLInputElement).checked)"
                  />
                  Use as background
                </label>
              </div>
              <div v-if="widget.url" class="aspect-video w-full overflow-hidden rounded-xl border border-[color:var(--dh-panel-border)] bg-black">
                <iframe
                  :src="computeYouTubeEmbed(widget.url)"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  class="h-full w-full"
                ></iframe>
              </div>
              <p v-else class="text-sm text-[color:var(--dh-panel-muted)]">Paste a YouTube link to embed.</p>
            </div>
            <div v-else-if="!widget.hidden && widget.type === 'spotify'" class="flex flex-col gap-3">
              <div v-if="widget.editing" class="flex flex-col gap-2">
                <input
                  :value="widget.title"
                  type="text"
                  placeholder="Title (optional)"
                  class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @input="updateWidget(widget.id, 'title', ($event.target as HTMLInputElement).value)"
                />
                <input
                  :value="widget.url"
                  type="url"
                  placeholder="Spotify URL (track/album/playlist)"
                  class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                  @input="updateWidget(widget.id, 'url', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div v-if="widget.url" class="w-full overflow-hidden rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)]">
                <iframe
                  :src="computeSpotifyEmbed(widget.url)"
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
        </dh-card>
      </div>
      <div
        v-else
        key="workspace-collapsed"
        class="dh-glass flex min-h-[280px] flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <p class="text-sm text-[color:var(--dh-panel-muted)]">
          Widgets are hidden. Bring them back whenever you need them.
        </p>
        <button type="button" class="dh-toggle" @click="$emit('toggle-collapsed')">
          Show Widgets
        </button>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import { computeSpotifyEmbed, computeYouTubeEmbed } from '../../utils/embeds'

import DhCard from '../core/DhCard.vue'
import CountdownWidgetCard from '../countdown/CountdownWidgetCard.vue'
import type { CountdownConfig } from '../countdown/types'

type WidgetSize = 'small' | 'medium' | 'large'

type SizeOption = {
  value: WidgetSize
  label: string
  columns: number
}

type NoteWidget = {
  id: string
  title: string
  body: string
  size: WidgetSize
  editing: boolean
  type: 'note'
}

type CountdownWidget = {
  id: string
  title: string
  size: WidgetSize
  editing: boolean
  type: 'countdown'
  countdown: CountdownConfig
  description: string
}
type YoutubeWidget = {
  id: string
  title: string
  url: string
  size: WidgetSize
  editing: boolean
  type: 'youtube'
  background: boolean
}

type SpotifyWidget = {
  id: string
  title: string
  url: string
  size: WidgetSize
  editing: boolean
  type: 'spotify'
}

type DashboardWidget = (NoteWidget | CountdownWidget | YoutubeWidget | SpotifyWidget) & { hidden?: boolean }

const props = defineProps<{
  widgets: DashboardWidget[]
  activeWidgetId: string | null
  sizeOptions: SizeOption[]
  spanClassForSize: (size: WidgetSize) => string
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-edit', id: string): void
  (e: 'remove-widget', id: string): void
  (e: 'update-widget', payload: { id: string; key: 'title' | 'body' | 'size' | 'url' | 'background' | 'hidden'; value: string | boolean }): void
  (
    e: 'update-countdown',
    payload: { id: string; config: CountdownConfig; title: string; description: string },
  ): void
  (e: 'toggle-collapsed'): void
}>()

const updateWidget = (
  id: string,
  key: 'title' | 'body' | 'size' | 'url' | 'background' | 'hidden',
  value: string | boolean,
) => {
  emit('update-widget', { id, key, value })
}

const updateCountdown = (
  id: string,
  payload: { config: CountdownConfig; title: string; description: string },
) => {
  emit('update-countdown', { id, ...payload })
}

const { widgets, activeWidgetId, sizeOptions, spanClassForSize, collapsed } = toRefs(props)
const visibleWidgets = computed(() => widgets.value.filter((w) => !w.hidden))

// embed helpers now shared via utils
</script>
