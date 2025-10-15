import { nextTick, ref } from 'vue'
import type { Ref } from 'vue'

import type { DashboardWidget } from './types'

export function useWidgetFocus(widgets: Ref<DashboardWidget[]>) {
  const activeWidgetId = ref<string | null>(widgets.value[0]?.id ?? null)

  const focusNoteTitle = (id: string) => {
    nextTick(() => {
      if (typeof window === 'undefined') return
      const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
      input?.focus()
    })
  }

  const focusWidget = (id: string) => {
    activeWidgetId.value = id
    const widget = widgets.value.find((entry) => entry.id === id)
    if (!widget) return
    if (!widget.editing) widget.editing = true
    if (widget.type === 'note') {
      focusNoteTitle(id)
    }
  }

  const toggleEditing = (id: string) => {
    const widget = widgets.value.find((entry) => entry.id === id)
    if (!widget) return
    widget.editing = !widget.editing
    activeWidgetId.value = id
    if (widget.editing && widget.type === 'note') {
      focusNoteTitle(id)
    }
  }

  return {
    activeWidgetId,
    focusWidget,
    toggleEditing,
    focusNoteTitle,
  }
}
