import type { TrackerPalette, TrackerButtonPalette, TrackerButtonState } from './types'

const createButtonPalette = (
  base: TrackerButtonState & { hoverBorder?: string; hoverShadow?: string },
  active: TrackerButtonState,
): TrackerButtonPalette => ({
  base,
  active,
})

export const fearPalette: TrackerPalette = {
  rail: 'rgba(122, 99, 215, 0.25)',
  fill: 'linear-gradient(135deg, rgba(122, 79, 235, 0.9), rgba(94, 168, 255, 0.85))',
  glow: 'rgba(142, 110, 250, 0.35)',
  burst: 'rgba(167, 139, 250, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(245, 242, 255, 0.94)',
      border: 'rgba(118, 104, 208, 0.32)',
      color: 'rgba(70, 47, 132, 0.65)',
      hoverBorder: 'rgba(145, 124, 238, 0.55)',
      hoverShadow: '0 20px 34px rgba(110, 140, 230, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(58, 28, 128, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(107, 70, 210, 0.95), rgba(139, 92, 255, 0.92))',
      border: 'rgba(152, 120, 255, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(110, 140, 230, 0.26)',
      iconAccent: 'rgba(58, 28, 128, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const emberPalette: TrackerPalette = {
  rail: 'rgba(230, 120, 80, 0.25)',
  fill: 'linear-gradient(135deg, rgba(240, 140, 100, 0.92), rgba(255, 198, 110, 0.85))',
  glow: 'rgba(250, 130, 90, 0.35)',
  burst: 'rgba(255, 160, 110, 0.5)',
  button: createButtonPalette(
    {
      background: 'rgba(255, 240, 232, 0.95)',
      border: 'rgba(246, 180, 130, 0.45)',
      color: 'rgba(160, 75, 40, 0.78)',
      hoverBorder: 'rgba(255, 170, 120, 0.78)',
      hoverShadow: '0 18px 32px rgba(240, 133, 90, 0.25)',
      shadow: undefined,
      iconAccent: 'rgba(186, 70, 30, 0.85)',
      iconFill: 'rgba(255, 250, 240, 0.9)',
    },
    {
      background: 'linear-gradient(135deg, rgba(240, 133, 90, 0.98), rgba(255, 188, 110, 0.9))',
      border: 'rgba(255, 190, 120, 0.9)',
      color: 'rgba(255, 253, 248, 0.95)',
      shadow: '0 20px 34px rgba(240, 133, 90, 0.28)',
      iconAccent: 'rgba(255, 215, 160, 0.95)',
      iconFill: 'rgba(255, 241, 224, 0.95)',
    },
  ),
}

export const tidePalette: TrackerPalette = {
  rail: 'rgba(86, 160, 220, 0.3)',
  fill: 'linear-gradient(135deg, rgba(60, 150, 210, 0.88), rgba(120, 200, 255, 0.82))',
  glow: 'rgba(68, 150, 222, 0.38)',
  burst: 'rgba(120, 190, 255, 0.45)',
  button: createButtonPalette(
    {
      background: 'rgba(232, 246, 255, 0.95)',
      border: 'rgba(128, 190, 240, 0.45)',
      color: 'rgba(38, 96, 140, 0.78)',
      hoverBorder: 'rgba(142, 202, 255, 0.78)',
      hoverShadow: '0 18px 32px rgba(88, 158, 220, 0.24)',
      shadow: undefined,
      iconAccent: 'rgba(18, 78, 124, 0.85)',
      iconFill: 'rgba(242, 252, 255, 0.9)',
    },
    {
      background: 'linear-gradient(135deg, rgba(68, 158, 220, 0.95), rgba(122, 206, 255, 0.88))',
      border: 'rgba(132, 210, 255, 0.9)',
      color: 'rgba(245, 250, 255, 0.97)',
      shadow: '0 20px 36px rgba(68, 150, 220, 0.26)',
      iconAccent: 'rgba(204, 238, 255, 0.92)',
      iconFill: 'rgba(255, 255, 255, 0.96)',
    },
  ),
}

export const cyberpunkPalette: TrackerPalette = {
  rail: 'rgba(255, 0, 255, 0.3)',
  fill: 'linear-gradient(135deg, rgba(255, 0, 255, 0.9), rgba(0, 255, 255, 0.85))',
  glow: 'rgba(255, 0, 255, 0.35)',
  burst: 'rgba(255, 0, 255, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(30, 0, 30, 0.94)',
      border: 'rgba(255, 0, 255, 0.32)',
      color: 'rgba(200, 100, 200, 0.65)',
      hoverBorder: 'rgba(255, 0, 255, 0.55)',
      hoverShadow: '0 20px 34px rgba(255, 0, 255, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(255, 0, 255, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(100, 0, 100, 0.95), rgba(0, 100, 100, 0.92))',
      border: 'rgba(255, 0, 255, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(255, 0, 255, 0.26)',
      iconAccent: 'rgba(255, 0, 255, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const naturePalette: TrackerPalette = {
  rail: 'rgba(100, 200, 100, 0.3)',
  fill: 'linear-gradient(135deg, rgba(80, 180, 80, 0.9), rgba(120, 220, 120, 0.85))',
  glow: 'rgba(100, 200, 100, 0.35)',
  burst: 'rgba(120, 220, 120, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(240, 255, 240, 0.94)',
      border: 'rgba(100, 200, 100, 0.32)',
      color: 'rgba(50, 150, 50, 0.65)',
      hoverBorder: 'rgba(120, 220, 120, 0.55)',
      hoverShadow: '0 20px 34px rgba(100, 200, 100, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(50, 150, 50, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(50, 150, 50, 0.95), rgba(100, 200, 100, 0.92))',
      border: 'rgba(120, 220, 120, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(100, 200, 100, 0.26)',
      iconAccent: 'rgba(50, 150, 50, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const techPalette: TrackerPalette = {
  rail: 'rgba(100, 100, 200, 0.3)',
  fill: 'linear-gradient(135deg, rgba(80, 80, 180, 0.9), rgba(120, 120, 220, 0.85))',
  glow: 'rgba(100, 100, 200, 0.35)',
  burst: 'rgba(120, 120, 220, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(240, 240, 255, 0.94)',
      border: 'rgba(100, 100, 200, 0.32)',
      color: 'rgba(50, 50, 150, 0.65)',
      hoverBorder: 'rgba(120, 120, 220, 0.55)',
      hoverShadow: '0 20px 34px rgba(100, 100, 200, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(50, 50, 150, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(50, 50, 150, 0.95), rgba(100, 100, 200, 0.92))',
      border: 'rgba(120, 120, 220, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(100, 100, 200, 0.26)',
      iconAccent: 'rgba(50, 50, 150, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const dangerPalette: TrackerPalette = {  
  rail: 'rgba(200, 50, 50, 0.3)',
  fill: 'linear-gradient(135deg, rgba(180, 30, 30, 0.9), rgba(220, 70, 70, 0.85))',     
  glow: 'rgba(200, 50, 50, 0.35)',
  burst: 'rgba(220, 70, 70, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(255, 240, 240, 0.94)',
      border: 'rgba(200, 50, 50, 0.32)',
      color: 'rgba(150, 20, 20, 0.65)',
      hoverBorder: 'rgba(220, 70, 70, 0.55)',
      hoverShadow: '0 20px 34px rgba(200, 50, 50, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(150, 20, 20, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(150, 20, 20, 0.95), rgba(200, 50, 50, 0.92))',
      border: 'rgba(220, 70, 70, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(200, 50, 50, 0.26)',
      iconAccent: 'rgba(150, 20, 20, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const corruptionPalette: TrackerPalette = {  
  rail: 'rgba(150, 0, 150, 0.3)',
  fill: 'linear-gradient(135deg, rgba(130, 0, 130, 0.9), rgba(170, 0, 170, 0.85))',     
  glow: 'rgba(150, 0, 150, 0.35)',
  burst: 'rgba(170, 0, 170, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(255, 240, 255, 0.94)',
      border: 'rgba(150, 0, 150, 0.32)',
      color: 'rgba(100, 0, 100, 0.65)',
      hoverBorder: 'rgba(170, 0, 170, 0.55)',
      hoverShadow: '0 20px 34px rgba(150, 0, 150, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(100, 0, 100, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(100, 0, 100, 0.95), rgba(150, 0, 150, 0.92))',
      border: 'rgba(170, 0, 170, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(150, 0, 150, 0.26)',
      iconAccent: 'rgba(100, 0, 100, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
    },
  ),
}

export const highContrastPalette: TrackerPalette = {
  rail: 'rgba(0, 0, 0, 0.3)',
  fill: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0.85))',
  glow: 'rgba(0, 0, 0, 0.35)',
  burst: 'rgba(0, 0, 0, 0.55)',
  button: createButtonPalette(
    {
      background: 'rgba(255, 255, 255, 0.94)',
      border: 'rgba(0, 0, 0, 0.32)',
      color: 'rgba(0, 0, 0, 0.65)',
      hoverBorder: 'rgba(0, 0, 0, 0.55)',
      hoverShadow: '0 20px 34px rgba(0, 0, 0, 0.26)',
      shadow: undefined,
      iconAccent: 'rgba(0, 0, 0, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.85)',
    },
    {
      background: 'linear-gradient(135deg, rgba(50, 50, 50, 0.95), rgba(200, 200, 200, 0.92))',
      border: 'rgba(0, 0, 0, 0.85)',
      color: 'rgba(255, 255, 255, 0.94)',
      shadow: '0 22px 38px rgba(0, 0, 0, 0.26)',
      iconAccent: 'rgba(0, 0, 0, 0.82)',
      iconFill: 'rgba(255, 255, 255, 0.94)',
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
