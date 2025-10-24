<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed right-4 top-4 z-[1200] flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col gap-3 overflow-y-auto pr-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto overflow-hidden rounded-2xl border p-4 shadow-xl shadow-black/10 backdrop-blur"
          :class="toneClass(notification.type)"
        >
          <div class="flex items-start gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base font-semibold">
              {{ toneIcon(notification.type) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold leading-snug">{{ notification.title }}</p>
              <p v-if="notification.description" class="mt-1 text-sm leading-snug opacity-90">
                {{ notification.description }}
              </p>
            </div>
            <button
              v-if="notification.dismissible"
              type="button"
              class="rounded-full p-1 text-sm font-semibold opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              @click="removeNotification(notification.id)"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useNotificationsStore } from '@/shared/stores'
import type { NotificationEntry } from '@/shared/stores'

let notificationsStore: ReturnType<typeof useNotificationsStore> | null = null

try {
  notificationsStore = useNotificationsStore()
} catch (error) {
  if (import.meta.env.DEV) {
    console.warn('[notifications] NotificationToaster rendered without an active Pinia instance.', error)
  }
}

const notifications = notificationsStore
  ? storeToRefs(notificationsStore).notifications
  : ref<NotificationEntry[]>([])

const removeNotification: (id: string) => void = notificationsStore
  ? notificationsStore.removeNotification
  : () => {}

const toneClass = (type: NotificationEntry['type']) => {
  switch (type) {
    case 'success':
      return 'border-emerald-200/60 bg-emerald-50/95 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-50'
    case 'warning':
      return 'border-amber-200/70 bg-amber-50/95 text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-50'
    case 'error':
      return 'border-red-200/70 bg-red-50/95 text-red-950 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-50'
    default:
      return 'border-sky-200/70 bg-sky-50/95 text-sky-950 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-50'
  }
}

const toneIcon = (type: NotificationEntry['type']) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'warning':
      return '!'
    case 'error':
      return '⚠'
    default:
      return 'i'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease, opacity 0.15s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
</style>
