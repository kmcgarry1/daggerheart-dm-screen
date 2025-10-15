import { ref, watch } from 'vue'
import { load, save } from '@/shared/utils'

export function useFear() {
  const fearLevel = ref(load<number>('fearLevel', 0))
  const setFearLevel = (value: number) => {
    const next = Math.max(0, Math.min(12, value))
    fearLevel.value = next
  }
  watch(fearLevel, (v) => save('fearLevel', v))
  return { fearLevel, setFearLevel }
}
