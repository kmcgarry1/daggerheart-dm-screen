import type { CountdownConfig } from '../components/countdown/types'

export type WidgetSize = 'small' | 'medium' | 'large'

export interface BaseWidget {
  id: string
  title: string
  size: WidgetSize
  editing: boolean
  hidden?: boolean
}

export interface NoteWidget extends BaseWidget {
  type: 'note'
  body: string
}

export interface CountdownWidget extends BaseWidget {
  type: 'countdown'
  description: string
  countdown: CountdownConfig
}

export interface YoutubeWidget extends BaseWidget {
  type: 'youtube'
  url: string
  background: boolean
  muted?: boolean
}

export interface SpotifyWidget extends BaseWidget {
  type: 'spotify'
  url: string
}

export type DashboardWidget = NoteWidget | CountdownWidget | YoutubeWidget | SpotifyWidget

export type WidgetType = DashboardWidget['type']

export interface SizeOption {
  value: WidgetSize
  label: string
  columns: number
}

export interface WidgetTypeOption {
  value: WidgetType
  label: string
  description: string
}
