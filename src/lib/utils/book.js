// Shared helpers to normalize book objects across different APIs
export function getBookTitle(b) {
  if (!b) return ''
  if (typeof b === 'string') return b
  return b.title || b.book_title || b.title_suggest || b.name || (b.volumeInfo && b.volumeInfo.title) || ''
}

export function getBookAuthor(b) {
  if (!b) return ''
  if (b.author) return b.author
  if (b.authors) return Array.isArray(b.authors) ? b.authors.join(', ') : String(b.authors)
  if (b.volumeInfo && b.volumeInfo.authors) return Array.isArray(b.volumeInfo.authors) ? b.volumeInfo.authors.join(', ') : String(b.volumeInfo.authors)
  return ''
}

export function getCoverImage(b) {
  if (!b) return null
  if (b.coverImage) return b.coverImage
  if (b.image) return b.image
  if (b.thumbnail) return b.thumbnail
  if (b.cover && b.cover.url) return b.cover.url
  if (b.volumeInfo && b.volumeInfo.imageLinks && b.volumeInfo.imageLinks.thumbnail) return b.volumeInfo.imageLinks.thumbnail
  // Map legacy `local:` URLs to the configured owner backend base (VITE_OWNER_BACKEND_URL)
  if (typeof b.coverImage === 'string' && b.coverImage.startsWith('local:')) {
    const key = b.coverImage.replace(/^local:/, '')
    // Prefer explicit owner backend URL (set in .env as VITE_OWNER_BACKEND_URL)
    const ownerBase = import.meta.env.VITE_OWNER_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(/:\d+$/, ':5001') : 'http://localhost:5001')
    return `${String(ownerBase).replace(/\/$/, '')}/uploads/${key}`
  }
  return null
}
