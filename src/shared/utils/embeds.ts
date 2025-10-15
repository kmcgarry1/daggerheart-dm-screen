export const computeYouTubeEmbed = (url: string): string => {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const parts = u.pathname.split('/').filter(Boolean)
      const last = parts[parts.length - 1]
      if (parts[0] === 'shorts' && last) return `https://www.youtube.com/embed/${last}`
    }
  } catch {}
  return ''
}

export const computeSpotifyEmbed = (url: string): string => {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('spotify.')) return ''
    return `https://open.spotify.com/embed${u.pathname}`
  } catch {}
  return ''
}

