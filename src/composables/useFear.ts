import { ref } from 'vue'

export function useFear() {
  const fearLevel = ref(0)
  const setFearLevel = (value: number) => {
    const next = Math.max(0, Math.min(12, value))
    fearLevel.value = next
  }
  return { fearLevel, setFearLevel }
}

