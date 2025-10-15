import { ref, watch } from 'vue'

export function useTheme() {
  const darkMode = ref(false)

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = darkMode.value ? 'dark' : 'light'
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
  }

  watch(darkMode, applyTheme, { immediate: true })

  return { darkMode, toggleDarkMode, applyTheme }
}

