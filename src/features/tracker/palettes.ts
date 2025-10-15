import type { TrackerPalette, TrackerButtonPalette, TrackerButtonState } from './types'

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '')

  if (![3, 6].includes(normalized.length)) {
    throw new Error(`Unsupported hex color: ${hex}`)
  }

  const values =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
      : normalized.match(/.{2}/g) ?? []

  const [r, g, b] = values.map((value) => parseInt(value, 16)) as [number, number, number]

  return [r, g, b]
}

const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const gradient = (from: string, to: string, fromAlpha = 0.95, toAlpha = 0.9) =>
  `linear-gradient(135deg, ${withAlpha(from, fromAlpha)}, ${withAlpha(to, toAlpha)})`

const dropShadow = (hex: string, alpha = 0.26, y = 20, blur = 34) =>
  `0 ${y}px ${blur}px ${withAlpha(hex, alpha)}`

const createButtonPalette = (
  base: TrackerButtonState & { hoverBorder?: string; hoverShadow?: string },
  active: TrackerButtonState,
): TrackerButtonPalette => ({
  base,
  active,
})

export const fearPalette: TrackerPalette = {
  rail: withAlpha('#6366F1', 0.28),
  fill: gradient('#7C3AED', '#4338CA', 0.92, 0.88),
  glow: withAlpha('#A855F7', 0.34),
  burst: withAlpha('#C4B5FD', 0.52),
  button: createButtonPalette(
    {
      background: withAlpha('#F5F3FF', 0.94),
      border: withAlpha('#C4B5FD', 0.45),
      color: withAlpha('#312E81', 0.82),
      hoverBorder: withAlpha('#C4B5FD', 0.78),
      hoverShadow: dropShadow('#7C3AED', 0.22, 18, 32),
      shadow: dropShadow('#7C3AED', 0.14, 12, 22),
      iconAccent: withAlpha('#7C3AED', 0.9),
      iconFill: withAlpha('#FFFFFF', 0.94),
    },
    {
      background: gradient('#6D28D9', '#4338CA', 0.96, 0.92),
      border: withAlpha('#C4B5FD', 0.9),
      color: withAlpha('#F9FAFB', 0.96),
      shadow: dropShadow('#7C3AED', 0.28, 20, 36),
      iconAccent: withAlpha('#EDE9FE', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const emberPalette: TrackerPalette = {
  rail: withAlpha('#F97316', 0.26),
  fill: gradient('#EA580C', '#F97316', 0.94, 0.88),
  glow: withAlpha('#FB923C', 0.35),
  burst: withAlpha('#FDBA74', 0.5),
  button: createButtonPalette(
    {
      background: withAlpha('#FFF7ED', 0.95),
      border: withAlpha('#FED7AA', 0.5),
      color: withAlpha('#9A3412', 0.82),
      hoverBorder: withAlpha('#FDBA74', 0.85),
      hoverShadow: dropShadow('#F97316', 0.22, 18, 32),
      shadow: dropShadow('#F97316', 0.14, 12, 22),
      iconAccent: withAlpha('#EA580C', 0.88),
      iconFill: withAlpha('#FFF4E5', 0.94),
    },
    {
      background: gradient('#EA580C', '#F97316', 0.98, 0.9),
      border: withAlpha('#FDBA74', 0.9),
      color: withAlpha('#FFFBEB', 0.96),
      shadow: dropShadow('#F97316', 0.28, 20, 36),
      iconAccent: withAlpha('#FFEDD5', 0.95),
      iconFill: withAlpha('#FFF7ED', 0.98),
    },
  ),
}

export const tidePalette: TrackerPalette = {
  rail: withAlpha('#0EA5E9', 0.28),
  fill: gradient('#0284C7', '#06B6D4', 0.94, 0.88),
  glow: withAlpha('#38BDF8', 0.36),
  burst: withAlpha('#BAE6FD', 0.5),
  button: createButtonPalette(
    {
      background: withAlpha('#F0FDFF', 0.96),
      border: withAlpha('#CFFAFE', 0.55),
      color: withAlpha('#0F4C81', 0.78),
      hoverBorder: withAlpha('#7DD3FC', 0.9),
      hoverShadow: dropShadow('#0EA5E9', 0.18, 18, 32),
      shadow: dropShadow('#0EA5E9', 0.12, 12, 22),
      iconAccent: withAlpha('#0E7490', 0.9),
      iconFill: withAlpha('#FFFFFF', 0.96),
    },
    {
      background: gradient('#0369A1', '#0EA5E9', 0.96, 0.9),
      border: withAlpha('#7DD3FC', 0.9),
      color: withAlpha('#F0FDFF', 0.97),
      shadow: dropShadow('#0EA5E9', 0.26, 20, 36),
      iconAccent: withAlpha('#E0F2FE', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const cyberpunkPalette: TrackerPalette = {
  rail: withAlpha('#F472B6', 0.32),
  fill: gradient('#D946EF', '#06B6D4', 0.92, 0.85),
  glow: withAlpha('#22D3EE', 0.38),
  burst: withAlpha('#F9A8D4', 0.5),
  button: createButtonPalette(
    {
      background: withAlpha('#2A0F3C', 0.88),
      border: withAlpha('#F472B6', 0.38),
      color: withAlpha('#FDEBFF', 0.88),
      hoverBorder: withAlpha('#22D3EE', 0.55),
      hoverShadow: dropShadow('#F472B6', 0.32, 20, 34),
      shadow: dropShadow('#F472B6', 0.22, 12, 22),
      iconAccent: withAlpha('#22D3EE', 0.9),
      iconFill: withAlpha('#FEF2FF', 0.9),
    },
    {
      background: gradient('#C026D3', '#0EA5E9', 0.95, 0.88),
      border: withAlpha('#F9A8D4', 0.85),
      color: withAlpha('#FDF4FF', 0.96),
      shadow: dropShadow('#22D3EE', 0.38, 20, 38),
      iconAccent: withAlpha('#22D3EE', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const naturePalette: TrackerPalette = {
  rail: withAlpha('#22C55E', 0.28),
  fill: gradient('#16A34A', '#22C55E', 0.94, 0.88),
  glow: withAlpha('#4ADE80', 0.36),
  burst: withAlpha('#BBF7D0', 0.52),
  button: createButtonPalette(
    {
      background: withAlpha('#F3FAF6', 0.95),
      border: withAlpha('#BBF7D0', 0.5),
      color: withAlpha('#14532D', 0.82),
      hoverBorder: withAlpha('#A7F3D0', 0.85),
      hoverShadow: dropShadow('#22C55E', 0.2, 18, 32),
      shadow: dropShadow('#22C55E', 0.14, 12, 22),
      iconAccent: withAlpha('#15803D', 0.88),
      iconFill: withAlpha('#F7FFF9', 0.95),
    },
    {
      background: gradient('#15803D', '#22C55E', 0.96, 0.9),
      border: withAlpha('#A7F3D0', 0.9),
      color: withAlpha('#F7FFF9', 0.96),
      shadow: dropShadow('#22C55E', 0.26, 20, 36),
      iconAccent: withAlpha('#DCFCE7', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const techPalette: TrackerPalette = {
  rail: withAlpha('#38BDF8', 0.26),
  fill: gradient('#1D4ED8', '#22D3EE', 0.94, 0.88),
  glow: withAlpha('#38BDF8', 0.34),
  burst: withAlpha('#CFFAFE', 0.48),
  button: createButtonPalette(
    {
      background: withAlpha('#F8FAFC', 0.95),
      border: withAlpha('#CBD5F5', 0.5),
      color: withAlpha('#0F172A', 0.82),
      hoverBorder: withAlpha('#93C5FD', 0.85),
      hoverShadow: dropShadow('#1D4ED8', 0.2, 18, 32),
      shadow: dropShadow('#1D4ED8', 0.14, 12, 22),
      iconAccent: withAlpha('#1E40AF', 0.9),
      iconFill: withAlpha('#FFFFFF', 0.94),
    },
    {
      background: gradient('#1D4ED8', '#22D3EE', 0.96, 0.9),
      border: withAlpha('#93C5FD', 0.9),
      color: withAlpha('#F8FAFC', 0.97),
      shadow: dropShadow('#1D4ED8', 0.26, 20, 36),
      iconAccent: withAlpha('#DBEAFE', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const dangerPalette: TrackerPalette = {
  rail: withAlpha('#F87171', 0.28),
  fill: gradient('#DC2626', '#F97316', 0.94, 0.88),
  glow: withAlpha('#F87171', 0.34),
  burst: withAlpha('#FECACA', 0.52),
  button: createButtonPalette(
    {
      background: withAlpha('#FEF2F2', 0.95),
      border: withAlpha('#FECACA', 0.5),
      color: withAlpha('#7F1D1D', 0.82),
      hoverBorder: withAlpha('#FCA5A5', 0.85),
      hoverShadow: dropShadow('#DC2626', 0.2, 18, 32),
      shadow: dropShadow('#DC2626', 0.14, 12, 22),
      iconAccent: withAlpha('#B91C1C', 0.88),
      iconFill: withAlpha('#FFF7F7', 0.95),
    },
    {
      background: gradient('#B91C1C', '#EF4444', 0.96, 0.9),
      border: withAlpha('#FCA5A5', 0.9),
      color: withAlpha('#FFF7F7', 0.96),
      shadow: dropShadow('#EF4444', 0.28, 20, 36),
      iconAccent: withAlpha('#FEE2E2', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const corruptionPalette: TrackerPalette = {
  rail: withAlpha('#C084FC', 0.3),
  fill: gradient('#7E22CE', '#DB2777', 0.92, 0.88),
  glow: withAlpha('#A855F7', 0.36),
  burst: withAlpha('#FBCFE8', 0.5),
  button: createButtonPalette(
    {
      background: withAlpha('#FDF2FF', 0.95),
      border: withAlpha('#F5D0FE', 0.5),
      color: withAlpha('#701A75', 0.82),
      hoverBorder: withAlpha('#F0ABFC', 0.85),
      hoverShadow: dropShadow('#A855F7', 0.22, 18, 32),
      shadow: dropShadow('#A855F7', 0.14, 12, 22),
      iconAccent: withAlpha('#A21CAF', 0.9),
      iconFill: withAlpha('#FFF5FF', 0.95),
    },
    {
      background: gradient('#A21CAF', '#DB2777', 0.96, 0.9),
      border: withAlpha('#F0ABFC', 0.9),
      color: withAlpha('#FFF5FF', 0.96),
      shadow: dropShadow('#F472B6', 0.28, 20, 36),
      iconAccent: withAlpha('#FCE7F3', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const highContrastPalette: TrackerPalette = {
  rail: withAlpha('#0F172A', 0.32),
  fill: gradient('#111827', '#1F2937', 0.95, 0.88),
  glow: withAlpha('#475569', 0.35),
  burst: withAlpha('#1E293B', 0.45),
  button: createButtonPalette(
    {
      background: withAlpha('#F8FAFC', 0.95),
      border: withAlpha('#CBD5E1', 0.55),
      color: withAlpha('#0F172A', 0.82),
      hoverBorder: withAlpha('#1E293B', 0.72),
      hoverShadow: dropShadow('#0F172A', 0.18, 18, 32),
      shadow: dropShadow('#0F172A', 0.12, 12, 22),
      iconAccent: withAlpha('#0F172A', 0.9),
      iconFill: withAlpha('#FFFFFF', 0.94),
    },
    {
      background: gradient('#111827', '#0F172A', 0.96, 0.9),
      border: withAlpha('#1E293B', 0.9),
      color: withAlpha('#F8FAFC', 0.97),
      shadow: dropShadow('#0F172A', 0.28, 20, 36),
      iconAccent: withAlpha('#E2E8F0', 0.95),
      iconFill: withAlpha('#FFFFFF', 0.98),
    },
  ),
}

export const trackerPalettes = {
  fear: fearPalette,
  ember: emberPalette,
  tide: tidePalette,
  cyberpunk: cyberpunkPalette,
  nature: naturePalette,
  tech: techPalette,
  danger: dangerPalette,
  corruption: corruptionPalette,
  highContrast: highContrastPalette,
}

export type TrackerPaletteName = keyof typeof trackerPalettes

export const getPalette = (name: TrackerPaletteName): TrackerPalette => trackerPalettes[name]
