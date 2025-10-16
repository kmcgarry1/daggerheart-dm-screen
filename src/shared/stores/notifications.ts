import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { createIdGenerator } from '@/shared/utils/id'

type NotificationKind = 'info' | 'success' | 'warning' | 'error'

export interface NotificationPayload {
  id?: string
  type?: NotificationKind
  title: string
  description?: string
  dismissible?: boolean
  timeout?: number | null
}

export interface NotificationEntry {
  id: string
  type: NotificationKind
  title: string
  description?: string
  createdAt: number
  dismissible: boolean
  timeout: number | null
}

const createNotificationId = createIdGenerator('notice')

const DEFAULT_TIMEOUT = 6000

type TimeoutHandle = ReturnType<typeof setTimeout>

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<NotificationEntry[]>([])
  const timers = new Map<string, TimeoutHandle>()

  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) => b.createdAt - a.createdAt),
  )

  const clearTimer = (id: string) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((entry) => entry.id !== id)
    clearTimer(id)
  }

  const scheduleRemoval = (id: string, timeout: number | null) => {
    if (timeout === null) return
    if (typeof window === 'undefined') return
    clearTimer(id)
    timers.set(
      id,
      setTimeout(() => {
        removeNotification(id)
      }, Math.max(timeout, 0)),
    )
  }

  const addNotification = (payload: NotificationPayload) => {
    const id = payload.id ?? createNotificationId()
    const type: NotificationKind = payload.type ?? 'info'
    const timeout =
      payload.timeout ?? (type === 'error' || type === 'warning' ? null : DEFAULT_TIMEOUT)

    const entry: NotificationEntry = {
      id,
      type,
      title: payload.title,
      description: payload.description,
      createdAt: Date.now(),
      dismissible: payload.dismissible ?? true,
      timeout,
    }

    notifications.value = [entry, ...notifications.value]
    scheduleRemoval(id, timeout)
    return id
  }

  const pushError = (title: string, description?: string) =>
    addNotification({ type: 'error', title, description, timeout: null })

  const pushWarning = (title: string, description?: string) =>
    addNotification({ type: 'warning', title, description, timeout: null })

  const clearNotifications = () => {
    notifications.value = []
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
  }

  return {
    notifications: sortedNotifications,
    addNotification,
    removeNotification,
    clearNotifications,
    pushError,
    pushWarning,
  }
})
