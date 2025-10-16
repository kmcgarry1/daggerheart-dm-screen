import type { DashboardWidget, SizeOption, WidgetType, WidgetTypeOption, WidgetSize } from './types'

export const sizeOptions: SizeOption[] = [
  { value: 'small', label: 'Compact', columns: 1 },
  { value: 'medium', label: 'Wide', columns: 2 },
  { value: 'large', label: 'Showcase', columns: 3 },
]

export const widgetTypeOptions: WidgetTypeOption[] = [
  { value: 'note', label: 'Notes Card', description: 'Write reminders, NPC motives, or scene beats.' },
  {
    value: 'countdown',
    label: 'Countdown Tracker',
    description: 'Configurable step tracker with palette, icon, and pacing options.',
  },
  {
    value: 'conditions',
    label: 'Conditions Reference',
    description: 'Large-type rules card with customizable accent colours for table visibility.',
  },
  { value: 'youtube', label: 'YouTube Embed', description: 'Embed a YouTube video; can set as background.' },
  { value: 'spotify', label: 'Spotify Embed', description: 'Embed a Spotify track, album, or playlist.' },
]

const sizeOptionMap = new Map(sizeOptions.map((option) => [option.value, option]))
const widgetTypeOptionMap = new Map(widgetTypeOptions.map((option) => [option.value, option]))

export const getSizeOption = (size: WidgetSize) => sizeOptionMap.get(size)
export const getWidgetTypeOption = (type: WidgetType) => widgetTypeOptionMap.get(type)

export const getSizeLabel = (size: WidgetSize) => getSizeOption(size)?.label ?? size
export const getWidgetTypeLabel = (type: WidgetType) => getWidgetTypeOption(type)?.label ?? type

export const createDefaultWidgets = (): DashboardWidget[] => [
  {
    id: '',
    title: 'Session Beats',
    body: 'Key NPC motivations, surprises to reveal, and challenges to escalate.',
    size: 'medium',
    editing: false,
    type: 'note' as const,
    hidden: false,
  },
  {
    id: '',
    title: 'Initiative Tracker',
    body: 'Pendry, Rowan, Syl, Maeve, Hunters x3',
    size: 'small',
    editing: false,
    type: 'note' as const,
    hidden: false,
  },
]
