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
  if (typeof b.coverImage === 'string' && b.coverImage.startsWith('local:')) return `http://localhost:5001/uploads/${b.coverImage.replace(/^local:/, '')}`
  return null
}
