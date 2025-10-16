import { describe, expect, it } from 'vitest'

import { computeSpotifyEmbed, computeYouTubeEmbed } from '@/shared/utils'

describe('computeYouTubeEmbed', () => {
  it('returns embed url for standard watch links', () => {
    expect(computeYouTubeEmbed('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('returns embed url for short links', () => {
    expect(computeYouTubeEmbed('https://youtu.be/xyz789')).toBe('https://www.youtube.com/embed/xyz789')
  })

  it('returns embed url for shorts links', () => {
    expect(computeYouTubeEmbed('https://www.youtube.com/shorts/short123')).toBe(
      'https://www.youtube.com/embed/short123',
    )
  })

  it('returns empty string for unsupported urls', () => {
    expect(computeYouTubeEmbed('https://example.com/video')).toBe('')
  })
})

describe('computeSpotifyEmbed', () => {
  it('returns embed url for spotify links', () => {
    expect(computeSpotifyEmbed('https://open.spotify.com/track/123')).toBe(
      'https://open.spotify.com/embed/track/123',
    )
  })

  it('returns empty string for unsupported hosts', () => {
    expect(computeSpotifyEmbed('https://example.com/track/123')).toBe('')
  })
})
