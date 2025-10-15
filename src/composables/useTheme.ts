import { ref, watch } from 'vue'
import { load, save } from '../utils/storage'

export function useTheme() {
  const darkMode = ref(load<boolean>('darkMode', false))

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }

  watch(darkMode, (v) => {
    save('darkMode', v)
    applyTheme()
  }, { immediate: true })

  return { darkMode, toggleDarkMode, applyTheme }
}
