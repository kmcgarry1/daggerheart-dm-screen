import { nextTick, ref } from 'vue'
import type { Ref } from 'vue'

import type { DashboardWidget } from './types'
import { reportError } from '@/shared/utils'

const focusContext = (action: string) => `widget-focus:${action}`

export function useWidgetFocus(widgets: Ref<DashboardWidget[]>) {
  const activeWidgetId = ref<string | null>(widgets.value[0]?.id ?? null)

  const focusNoteTitle = (id: string) => {
    nextTick(() => {
      try {
        if (typeof window === 'undefined') return
        const input = window.document.querySelector<HTMLInputElement>(`#${id}-title`)
        input?.focus()
      } catch (error) {
        reportError('We could not focus that note.', error, {
          context: focusContext(`note:${id}`),
          oncePerContext: true,
        })
      }
    })
  }

  const focusWidget = (id: string) => {
    try {
      activeWidgetId.value = id
      const widget = widgets.value.find((entry) => entry.id === id)
      if (!widget) {
        reportError('We could not find that widget to focus.', new Error(`Missing widget: ${id}`), {
          context: focusContext(`missing:${id}`),
          oncePerContext: true,
        })
        return
      }
      if (!widget.editing) widget.editing = true
      if (widget.type === 'note') {
        focusNoteTitle(id)
      }
    } catch (error) {
      reportError('We could not focus that widget.', error, {
        context: focusContext('focus'),
      })
    }
  }

  const toggleEditing = (id: string) => {
    try {
      const widget = widgets.value.find((entry) => entry.id === id)
      if (!widget) {
        reportError('We could not toggle that widget.', new Error(`Missing widget: ${id}`), {
          context: focusContext(`toggle:${id}`),
          oncePerContext: true,
        })
        return
      }
      widget.editing = !widget.editing
      activeWidgetId.value = id
      if (widget.editing && widget.type === 'note') {
        focusNoteTitle(id)
      }
    } catch (error) {
      reportError('We could not update the widget editor.', error, {
        context: focusContext('toggle'),
      })
    }
  }

  return {
    activeWidgetId,
    focusWidget,
    toggleEditing,
    focusNoteTitle,
  }
}
