import { getActivePinia } from 'pinia'

import { useNotificationsStore } from '@/shared/stores'

const reportedContexts = new Set<string>()

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

export interface ReportErrorOptions {
  context?: string
  description?: string
  oncePerContext?: boolean
  tone?: 'error' | 'warning'
}

export const resolveErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message || DEFAULT_MESSAGE
  if (typeof error === 'string') return error || DEFAULT_MESSAGE
  try {
    return JSON.stringify(error)
  } catch {
    return DEFAULT_MESSAGE
  }
}

export const reportError = (title: string, error: unknown, options?: ReportErrorOptions) => {
  const description = options?.description ?? resolveErrorMessage(error)
  const contextKey = options?.context ?? title
  const shouldSkip = options?.oncePerContext && reportedContexts.has(contextKey)

  if (!shouldSkip) {
    if (options?.oncePerContext) {
      reportedContexts.add(contextKey)
    }

    if (import.meta.env.DEV) {
      console.error(`[${title}]`, error)
    } else {
      console.error(`[${title}] ${description}`)
    }

    try {
      if (!getActivePinia()) return
      const notifications = useNotificationsStore()
      const tone = options?.tone ?? 'error'
      if (tone === 'warning') {
        notifications.pushWarning(title, description)
      } else {
        notifications.pushError(title, description)
      }
    } catch (notificationError) {
      console.error('Failed to deliver error notification', notificationError)
    }
  }
}
