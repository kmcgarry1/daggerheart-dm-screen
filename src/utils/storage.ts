// Simple localStorage wrapper with namespacing and JSON handling
const NAMESPACE = 'dh-screen'
const VERSION = 1

type Stored<T> = { v: number; data: T }

export function save<T>(key: string, value: T) {
  if (typeof localStorage === 'undefined') return
  try {
    const payload: Stored<T> = { v: VERSION, data: value }
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(payload))
  } catch {
    // ignore quota or serialization errors
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
  } catch {
    return fallback
  }
}

const isStored = <T>(value: unknown): value is Stored<T> =>
  typeof value === 'object' && value !== null && 'v' in value && 'data' in value

export function remove(key: string) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(`${NAMESPACE}:${key}`)
  } catch {
    // ignore
  }
}

