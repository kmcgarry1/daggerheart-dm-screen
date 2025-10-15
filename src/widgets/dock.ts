import { computed } from 'vue'
import type { Ref } from 'vue'

import { getWidgetTypeLabel } from './options'
import type { DashboardWidget, WidgetType } from './types'

export function useWidgetDock(widgets: Ref<DashboardWidget[]>, onFocus?: (id: string) => void) {
  const minimizedWidgets = computed(() => widgets.value.filter((widget) => widget.hidden))

  const restoreWidget = (id: string) => {
    const widget = widgets.value.find((entry) => entry.id === id)
    if (!widget) return
    widget.hidden = false
    onFocus?.(id)
  }

  const dockLabel = (type: WidgetType) => getWidgetTypeLabel(type)

  const widgetIcon = (type: WidgetType) => {
    switch (type) {
      case 'note':
        return '📝'
      case 'countdown':
        return '⏱️'
      case 'youtube':
        return '▶'
      case 'spotify':
        return '🎵'
      default:
        return '📦'
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
