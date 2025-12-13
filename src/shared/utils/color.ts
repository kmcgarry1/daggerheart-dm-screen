export type RgbTuple = [number, number, number]

const isValidHexLength = (length: number) => length === 3 || length === 6

const expandShorthandHex = (hex: string) => hex.split('').map((char) => `${char}${char}`)

const splitHexPairs = (hex: string) => hex.match(/.{2}/g) ?? []

const parseHexValues = (values: string[]): RgbTuple | null => {
  if (values.length < 3) {
    return null
  }

  const parsed = values.map((value) => parseInt(value, 16)) as RgbTuple

  return parsed.some((value) => Number.isNaN(value)) ? null : parsed
}

export const hexToRgb = (hex: string, fallback?: RgbTuple): RgbTuple => {
  const normalized = hex.replace('#', '').trim().toLowerCase()

  if (!isValidHexLength(normalized.length)) {
    if (fallback) {
      return fallback
    }
    throw new Error(
      `Unsupported hex color: ${hex}. Expected formats: '#fff' or '#ffffff'.`,
    )
  }

  const rawValues =
    normalized.length === 3 ? expandShorthandHex(normalized) : splitHexPairs(normalized)

  const parsed = parseHexValues(rawValues)

  if (!parsed) {
    if (fallback) {
      return fallback
    }

    throw new Error(
      `Invalid hex color: ${hex}. Unable to parse RGB components.`,
    )
  }

  return parsed
}
