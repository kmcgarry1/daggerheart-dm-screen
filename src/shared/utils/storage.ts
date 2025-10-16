import { reportError } from './errors'

// Simple localStorage wrapper with namespacing and JSON handling
const NAMESPACE = 'dh-screen'
const VERSION = 1

type Stored<T> = { v: number; data: T }

type StorageOperation = 'load' | 'save' | 'remove'

const storageContext = (operation: StorageOperation, key: string) => `storage:${operation}:${key}`

const isStored = <T>(value: unknown): value is Stored<T> => {
  if (typeof value !== 'object' || value === null) return false
  if (!('v' in value) || !('data' in value)) return false
  const candidate = value as { v?: unknown; data?: unknown }
  return typeof candidate.v === 'number'
}

export function save<T>(key: string, value: T) {
  if (typeof localStorage === 'undefined') return
  try {
    const payload: Stored<T> = { v: VERSION, data: value }
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(payload))
  } catch (error) {
    reportError('We could not save your latest changes.', error, {
      context: storageContext('save', key),
      oncePerContext: true,
      tone: 'warning',
    })
  }
}

export function load<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${key}`)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as unknown
    if (isStored<T>(parsed)) {
      return parsed.data
    }
    return parsed as T
  } catch (error) {
    reportError('We had trouble loading your saved data.', error, {
      context: storageContext('load', key),
      oncePerContext: true,
      tone: 'warning',
    })
    return fallback
  }
}

export function remove(key: string) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(`${NAMESPACE}:${key}`)
  } catch (error) {
    reportError('We could not clear your saved data.', error, {
      context: storageContext('remove', key),
      oncePerContext: true,
      tone: 'warning',
    })
  }
}
