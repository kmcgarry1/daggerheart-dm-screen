<template>
  <div class="flex flex-col gap-3">
    <textarea
      v-if="widget.editing"
      :value="widget.body"
      rows="4"
      placeholder="Notes, trackers, reminders..."
      class="w-full rounded-xl border border-violet-200/70 bg-[var(--dh-panel-bg)] px-3 py-3 text-sm text-[color:var(--dh-panel-text)] shadow-sm focus:border-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
      @input="onBodyInput"
    ></textarea>
    <p v-else class="text-sm leading-relaxed text-[color:var(--dh-panel-muted)]">
      {{ widget.body || 'Add notes or quick references for your session.' }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { NoteWidget } from '@/features/dm-screen/widgets'

defineProps<{ widget: NoteWidget }>()

const emit = defineEmits<{ (e: 'update-body', value: string): void }>()

const onBodyInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement | null
  emit('update-body', target?.value ?? '')
}
</script>
