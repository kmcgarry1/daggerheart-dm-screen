<template>
  <div class="flex flex-col gap-6">
    <section class="space-y-6">
      <header class="space-y-3">
        <p
          class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--dh-panel-muted)]"
        >
          Conditions Reference
        </p>
        <h2
          class="font-black uppercase tracking-[0.12em] text-[clamp(2.25rem,3vw,3rem)]"
          :style="titleStyle"
        >
          {{ displayTitle }}
        </h2>
        <div
          class="h-1 rounded-full transition-all duration-300"
          :class="dividerWidthClass"
          :style="dividerStyle"
        ></div>
      </header>

      <p
        class="font-semibold leading-relaxed text-[clamp(1.35rem,2.2vw,1.85rem)] text-[color:var(--dh-panel-text)]"
      >
        {{ displayDescription }}
      </p>
    </section>

    <section
      v-if="widget.editing"
      class="flex flex-col gap-6 rounded-2xl border border-[color:var(--dh-panel-border)] bg-[color:var(--dh-panel-bg)]/65 p-5"
    >
      <label
        class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Condition Name</span>
        <input
          :value="widget.title"
          type="text"
          class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-3 text-lg font-bold uppercase tracking-[0.08em] text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          placeholder="Enter condition title"
          @input="onTitleInput"
        />
      </label>

      <label
        class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]"
      >
        <span>Rules Text</span>
        <textarea
          :value="widget.description"
          rows="6"
          class="w-full rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-3 text-base font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          placeholder="Describe the condition effects, saving throws, and recovery options."
          @input="onDescriptionInput"
        ></textarea>
      </label>

      <div class="grid gap-5 md:grid-cols-2">
        <fieldset class="flex flex-col gap-3">
          <legend class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]">
            Title Accent
          </legend>
          <button
            v-for="option in accentOptions"
            :key="`title-${option.id}`"
            type="button"
            class="flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            :class="buttonClass(widget.titleColor, option.value)"
            @click="updateWidget('titleColor', option.value)"
          >
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-white shadow-lg"
              :style="{ background: option.value }"
            >
              {{ option.sample }}
            </span>
            <span>
              {{ option.label }}
            </span>
          </button>
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dh-panel-muted)]">
            Divider Accent
          </legend>
          <button
            v-for="option in accentOptions"
            :key="`divider-${option.id}`"
            type="button"
            class="flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            :class="buttonClass(widget.dividerColor, option.value)"
            @click="updateWidget('dividerColor', option.value)"
          >
            <span
              class="inline-flex h-9 w-16 items-center justify-center rounded-full text-xs font-bold uppercase text-white shadow-lg"
              :style="{ background: option.value }"
            >
              {{ option.sample }}
            </span>
            <span>
              {{ option.label }}
            </span>
          </button>
        </fieldset>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { ConditionsWidget, WidgetUpdateKey } from '@/features/dm-screen/widgets'

const props = defineProps<{
  widget: ConditionsWidget
}>()

const emit = defineEmits<{
  (e: 'update', payload: { key: WidgetUpdateKey; value: string }): void
}>()

interface AccentOption {
  id: string
  label: string
  value: string
  sample: string
}

const accentOptions: AccentOption[] = [
  { id: 'radiant-gold', label: 'Radiant Gold', value: '#fbbf24', sample: 'GLD' },
  { id: 'arcane-violet', label: 'Arcane Violet', value: '#a855f7', sample: 'ARC' },
  { id: 'far-realm-cyan', label: 'Far Realm Cyan', value: '#22d3ee', sample: 'CYN' },
  { id: 'sylvan-emerald', label: 'Sylvan Emerald', value: '#34d399', sample: 'EMR' },
  { id: 'ember-rose', label: 'Ember Rose', value: '#f472b6', sample: 'ROS' },
  { id: 'steel-slate', label: 'Steel Slate', value: '#94a3b8', sample: 'SLT' },
]

const DEFAULT_TITLE = 'Condition Rules'
const DEFAULT_DESCRIPTION =
  'Outline the lingering impact of battle scars, cursed veils, or temporary boons so everyone stays aligned.'
const DEFAULT_ACCENT = '#a855f7'

const displayTitle = computed(() => props.widget.title?.trim() || DEFAULT_TITLE)
const displayDescription = computed(() => props.widget.description?.trim() || DEFAULT_DESCRIPTION)

const titleStyle = computed(() => ({
  color: props.widget.titleColor || DEFAULT_ACCENT,
  textShadow: `0 8px 24px ${hexToShadow(props.widget.titleColor || DEFAULT_ACCENT)}`,
}))

const dividerStyle = computed(() => ({
  background: props.widget.dividerColor || props.widget.titleColor || DEFAULT_ACCENT,
  boxShadow: `0 6px 20px ${hexToShadow(props.widget.dividerColor || props.widget.titleColor || DEFAULT_ACCENT)}`,
}))

const dividerWidthClass = computed(() =>
  props.widget.size === 'large' ? 'w-40' : props.widget.size === 'small' ? 'w-16' : 'w-28',
)

const updateWidget = (key: WidgetUpdateKey, value: string) => {
  emit('update', { key, value })
}

const onDescriptionInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null
  updateWidget('description', target?.value ?? '')
}

const onTitleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  updateWidget('title', target?.value ?? '')
}

const buttonClass = (selected: string | undefined, value: string) =>
  selected === value
    ? 'border-transparent bg-gradient-to-r from-violet-500/90 to-indigo-500/80 text-white shadow-xl'
    : 'border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] text-[color:var(--dh-panel-text)] shadow-sm'

const hexToShadow = (hex: string) => {
  const parsed = parseHex(hex)
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, 0.45)`
}

const parseHex = (hex: string) => {
  const clean = hex.replace('#', '').trim()
  const fallback = { r: 168, g: 85, b: 247 }
  if (clean.length === 3) {
    const r = parseInt(clean.charAt(0) + clean.charAt(0), 16)
    const g = parseInt(clean.charAt(1) + clean.charAt(1), 16)
    const b = parseInt(clean.charAt(2) + clean.charAt(2), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return fallback
    }
    return { r, g, b }
  }
  if (clean.length < 6) {
    return fallback
  }
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return fallback
  }
  return { r, g, b }
}
</script>
