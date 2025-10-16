<template>
  <div
    class="fixed inset-0 z-40 flex items-start justify-end bg-black/30 px-4 py-6 backdrop-blur-sm sm:px-8 sm:py-12"
    role="dialog"
    aria-modal="true"
    aria-label="Widget library"
    @click.self="$emit('close')"
  >
    <div
      class="dh-glass relative flex h-full max-h-[min(960px,90vh)] w-full max-w-lg flex-col gap-8 overflow-y-auto rounded-3xl p-6 shadow-2xl"
    >
      <button
        type="button"
        class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--dh-panel-border)] bg-[color:var(--dh-panel-bg)] text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label="Close widget library"
        @click="$emit('close')"
      >
        ×
      </button>
      <div class="flex flex-col gap-8 pt-6">
        <section class="flex flex-col gap-4">
          <header class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--dh-panel-muted)]">
              Widget Library
            </p>
            <h2 class="text-xl font-semibold">Create Dashboard Widget</h2>
          </header>
          <p class="text-sm text-[color:var(--dh-panel-muted)]">
            Pick a size, choose a style, then drop in a new card. Everything stays editable directly on the board.
          </p>
          <div class="flex flex-col gap-3" role="tablist" aria-label="Widget size presets">
            <button
              v-for="option in sizeOptions"
              :key="option.value"
              type="button"
              class="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              :class="[
                option.value === nextWidgetSize
                  ? 'border-transparent bg-gradient-to-r from-violet-500/90 to-sky-500/80 text-white shadow-xl'
                  : 'border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] text-[color:var(--dh-panel-text)]',
              ]"
              @click="$emit('update:size', option.value)"
            >
              <span>{{ option.label }}</span>
              <span
                class="text-xs font-medium"
                :class="option.value === nextWidgetSize ? 'opacity-80' : 'text-[color:var(--dh-panel-muted)]'"
              >
                {{ option.columns }} {{ option.columns === 1 ? 'column' : 'columns' }}
              </span>
            </button>
          </div>
          <label
            class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--dh-panel-muted)]"
          >
            <span>Widget Type</span>
            <select
              :value="nextWidgetType"
              class="rounded-xl border border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--dh-panel-text)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              @change="$emit('update:type', ($event.target as HTMLSelectElement).value as WidgetType)"
            >
              <option v-for="option in widgetTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <p class="text-xs text-[color:var(--dh-panel-muted)]">
            {{ selectedTypeOption?.description }}
          </p>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            @click="$emit('create:widget')"
          >
            + New {{ nextWidgetSizeLabel }} {{ selectedTypeOption?.label ?? 'Widget' }}
          </button>
        </section>

        <section class="flex flex-col gap-4">
          <header class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--dh-panel-muted)]">
              Atmosphere
            </p>
            <h2 class="text-xl font-semibold">Dashboard Backdrop</h2>
          </header>
          <p class="text-sm text-[color:var(--dh-panel-muted)]">
            Upload a collection of images to cycle softly behind your command center.
          </p>
          <p class="text-xs text-[color:var(--dh-panel-muted)]">
            If a YouTube widget is set as background, it will play behind the dashboard.
          </p>
          <input
            ref="fileInputRef"
            class="hidden"
            type="file"
            accept="image/*"
            multiple
            @change="onBackgroundInput"
          />
          <div class="flex flex-col gap-3">
            <button type="button" class="dh-toggle dh-toggle--subtle justify-center" @click="triggerUpload">
              Upload Background Images
            </button>
            <button
              v-if="hasBackgrounds"
              type="button"
              class="dh-pill dh-pill--muted text-center"
              @click="$emit('clear-backgrounds')"
            >
              Clear ({{ backgroundCount }})
            </button>
          </div>
        </section>

        <section class="flex flex-col gap-4" aria-live="polite">
          <header class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--dh-panel-muted)]">
              Dashboard Content
            </p>
            <h2 class="text-xl font-semibold">
              {{ widgets.length }} Widget{{ widgets.length === 1 ? '' : 's' }}
            </h2>
          </header>
          <ul class="flex flex-col gap-2">
            <li v-for="widget in widgets" :key="widget.id">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                :class="[
                  widget.id === activeWidgetId
                    ? 'border-transparent bg-gradient-to-r from-violet-500/90 to-indigo-500/80 text-white shadow-xl'
                    : 'border-[color:var(--dh-panel-border)] bg-[var(--dh-panel-bg)] text-[color:var(--dh-panel-text)] shadow-sm hover:shadow-lg',
                ]"
                @click="$emit('focus-widget', widget.id)"
              >
                <span>
                  <span class="block text-sm font-semibold">{{ widget.title || 'Untitled Widget' }}</span>
                  <span
                    class="block text-xs font-medium"
                    :class="widget.id === activeWidgetId ? 'opacity-80' : 'text-[color:var(--dh-panel-muted)]'"
                  >
                    {{ sizeLabel(widget.size) }} · {{ typeLabel(widget.type) }}
                  </span>
                </span>
                <span
                  class="text-xs font-semibold uppercase tracking-wide"
                  :class="widget.id === activeWidgetId ? 'opacity-85' : 'text-[color:var(--dh-panel-muted)]'"
                >
                  {{ widget.editing ? 'Editing' : 'View' }}
                </span>
              </button>
            </li>
            <li
              v-if="widgets.length === 0"
              class="rounded-2xl border border-dashed border-[color:var(--dh-panel-border)] px-3 py-4 text-center text-sm text-[color:var(--dh-panel-muted)]"
            >
              No widgets yet. Create one to get started.
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue'

import {
  getSizeLabel,
  getWidgetTypeOption,
  type DashboardWidget,
  type SizeOption,
  type WidgetSize,
  type WidgetType,
  type WidgetTypeOption,
} from '@/features/dm-screen/widgets'

const props = defineProps<{
  sizeOptions: SizeOption[]
  nextWidgetSize: WidgetSize
  nextWidgetSizeLabel: string
  widgetTypeOptions: WidgetTypeOption[]
  nextWidgetType: WidgetType
  widgets: DashboardWidget[]
  activeWidgetId: string | null
  backgroundCount: number
  hasBackgrounds: boolean
}>()

const emit = defineEmits<{
  (e: 'update:size', value: WidgetSize): void
  (e: 'update:type', value: WidgetType): void
  (e: 'create:widget'): void
  (e: 'upload-backgrounds', files: File[]): void
  (e: 'clear-backgrounds'): void
  (e: 'focus-widget', id: string): void
  (e: 'close'): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const {
  sizeOptions,
  nextWidgetSize,
  nextWidgetSizeLabel,
  widgetTypeOptions,
  nextWidgetType,
  widgets,
  activeWidgetId,
  backgroundCount,
  hasBackgrounds,
} = toRefs(props)

const selectedTypeOption = computed(() => getWidgetTypeOption(nextWidgetType.value))

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const onBackgroundInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const files = target?.files
  if (!files || files.length === 0) return
  emit('upload-backgrounds', Array.from(files))
  if (target) target.value = ''
}

const sizeLabel = (size: WidgetSize) => getSizeLabel(size)

const typeLabel = (type: WidgetType) => getWidgetTypeOption(type)?.label ?? type
</script>
