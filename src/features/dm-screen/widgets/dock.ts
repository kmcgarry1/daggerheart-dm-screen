import { shallowRef, watchEffect } from 'vue'
import type { Ref } from 'vue'

import { getWidgetTypeLabel } from './options'
import type { DashboardWidget, WidgetType } from './types'
import { reportError } from '@/shared/utils'

const dockContext = (action: string) => `widget-dock:${action}`

export function useWidgetDock(widgets: Ref<DashboardWidget[]>, onFocus?: (id: string) => void) {
  const minimizedWidgets = shallowRef<DashboardWidget[]>([])

  watchEffect(() => {
    minimizedWidgets.value = widgets.value.filter((widget) => widget.hidden)
  })

  const restoreWidget = (id: string) => {
    try {
      const widget = widgets.value.find((entry) => entry.id === id)
      if (!widget) {
        reportError('We could not restore that widget.', new Error(`Missing widget: ${id}`), {
          context: dockContext(`restore:${id}`),
          oncePerContext: true,
        })
        return
      }
      widget.hidden = false
      onFocus?.(id)
    } catch (error) {
      reportError('We could not restore that widget.', error, {
        context: dockContext('restore'),
      })
    }
  }

  const dockLabel = (type: WidgetType) => getWidgetTypeLabel(type)

  const widgetIcon = (type: WidgetType) => {
    switch (type) {
      case 'note':
        return 'N'
      case 'countdown':
        return 'CD'
      case 'conditions':
        return 'CR'
      case 'youtube':
        return 'YT'
      case 'spotify':
        return 'SP'
      default:
        return 'WG'
    }
  }

  const countdownDockLabel = (widget: DashboardWidget) => {
    if (widget.type !== 'countdown') {
      return widget.title || dockLabel(widget.type)
    }
    const total = Math.max(0, widget.countdown.stepCount)
    const current = Math.max(0, Math.min(widget.countdown.progress ?? 0, total))
    return `${widget.title || 'Countdown'} (${current}/${total})`
  }

  return {
    minimizedWidgets,
    restoreWidget,
    dockLabel,
    widgetIcon,
    countdownDockLabel,
  }
}
