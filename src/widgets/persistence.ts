import { ref, watch } from 'vue'

import { load, save } from '../utils/storage'
import type { DashboardWidget } from './types'

export type WidgetInitializer = () => DashboardWidget[]

export function useWidgetPersistence(createInitialWidgets: WidgetInitializer) {
  const initialWidgets = createInitialWidgets().map((widget) => ({ ...widget }))
  const widgets = ref<DashboardWidget[]>(load<DashboardWidget[]>('widgets', initialWidgets))

  watch(widgets, (value) => save('widgets', value), { deep: true })

  return { widgets }
}
