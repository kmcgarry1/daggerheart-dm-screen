import type { CountdownConfig } from '@/features/countdown'
import {
  assignWidgetIds,
  createDefaultWidgets,
  useWidgetDock,
  useWidgetFactory,
  useWidgetFocus,
  useWidgetPersistence,
  type WidgetUpdatePayload,
} from '@/features/dm-screen/widgets'
import { reportError } from '@/shared/utils'

export function useWidgets() {
  const { widgets } = useWidgetPersistence(() => {
    try {
      return assignWidgetIds(createDefaultWidgets())
    } catch (error) {
      reportError('We could not prepare your widgets.', error, {
        context: 'widgets:initialize',
      })
      return []
    }
  })

  try {
    widgets.value = assignWidgetIds(widgets.value)
  } catch (error) {
    reportError('We could not restore your saved widgets.', error, {
      context: 'widgets:restore',
    })
    widgets.value = []
  }

  const focus = useWidgetFocus(widgets)
  const factory = useWidgetFactory({
    widgets,
    activeWidgetId: focus.activeWidgetId,
    focusNoteTitle: focus.focusNoteTitle,
  })
  const dock = useWidgetDock(widgets, focus.focusWidget)

  const removeWidget = (id: string) => {
    try {
      widgets.value = widgets.value.filter((widget) => widget.id !== id)
      if (focus.activeWidgetId.value === id) {
        focus.activeWidgetId.value = widgets.value[0]?.id ?? null
      }
    } catch (error) {
      reportError('We could not remove that widget.', error, {
        context: 'widgets:remove',
      })
    }
  }

  const handleWidgetUpdate = (payload: WidgetUpdatePayload) => {
    factory.handleWidgetUpdate(payload)
  }

  const handleCountdownUpdate = (payload: { id: string; config: CountdownConfig; title: string; description: string }) => {
    factory.handleCountdownUpdate(payload)
  }

  return {
    widgets,
    sizeOptions: factory.sizeOptions,
    widgetTypeOptions: factory.widgetTypeOptions,
    nextWidgetSize: factory.nextWidgetSize,
    nextWidgetSizeLabel: factory.nextWidgetSizeLabel,
    nextWidgetType: factory.nextWidgetType,
    activeWidgetId: focus.activeWidgetId,
    addWidget: factory.addWidget,
    toggleEditing: focus.toggleEditing,
    handleWidgetUpdate,
    handleCountdownUpdate,
    removeWidget,
    focusWidget: focus.focusWidget,
    handleSizeSelect: factory.handleSizeSelect,
    handleTypeSelect: factory.handleTypeSelect,
    widgetSpanClass: factory.widgetSpanClass,
    minimizedWidgets: dock.minimizedWidgets,
    restoreWidget: dock.restoreWidget,
    dockLabel: dock.dockLabel,
    widgetIcon: dock.widgetIcon,
    countdownDockLabel: dock.countdownDockLabel,
  }
}
