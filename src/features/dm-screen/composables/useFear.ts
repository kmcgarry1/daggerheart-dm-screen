import { ref } from 'vue'
import { load, save, watchDebounced } from '@/shared/utils'

export function useFear() {
  const fearLevel = ref(load<number>('fearLevel', 0))
  let lastPersisted = fearLevel.value
  const setFearLevel = (value: number) => {
    const next = Math.max(0, Math.min(12, value))
    fearLevel.value = next
    lastPersisted = next
    save('fearLevel', next)
  }
  watchDebounced(
    fearLevel,
    (value) => {
      if (value === lastPersisted) return
      lastPersisted = value
      save('fearLevel', value)
    },
    {
      debounce: 200,
      maxWait: 1000,
    },
  )
  return { fearLevel, setFearLevel }
}
