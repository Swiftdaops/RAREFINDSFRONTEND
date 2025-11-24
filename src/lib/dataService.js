import { api as http } from '../api/httpClient'

const mockResults = [
  { id: 'm1', title: 'The Great Gatsby (Mock)', author: 'F. Scott Fitzgerald', price: 1200, coverUrl: null },
  { id: 'm2', title: '1984 (Mock)', author: 'George Orwell', price: 1500, coverUrl: null },
]

async function tryEndpoints(endpoints) {
  for (const url of endpoints) {
    try {
      const res = await http.get(url)
      if (Array.isArray(res.data)) return res.data
    } catch (err) {
      // If 404, try next endpoint; for other errors, log and continue trying alternatives
      if (err?.response?.status && err.response.status !== 404) {
        // eslint-disable-next-line no-console
        console.error(`Request to ${url} failed:`, err?.message || err)
      }
      // continue to next endpoint
    }
  }
  return null
}

/**
 * Search books across public endpoints. Tries multiple candidate endpoints and falls
 * back to mock data when none are available.
 */
export async function searchBooks(q) {
  if (!q) return []
  const encoded = encodeURIComponent(q)
  const endpoints = [
    `/api/ebooks?q=${encoded}`,
    `/api/books?q=${encoded}`,
    `/api/books/all?q=${encoded}`,
    `/api/public/books?q=${encoded}`,
  ]

  const data = await tryEndpoints(endpoints)
  if (Array.isArray(data)) return data
  // fallback
  return mockResults
}

/**
 * Fetch all public books (no query). Tries multiple endpoints and falls back to mock.
 */
export async function fetchAllBooks() {
  const endpoints = ['/api/books', '/api/books/all', '/api/public/books', '/api/ebooks']
  const data = await tryEndpoints(endpoints)
  if (Array.isArray(data)) return data
  return mockResults
}

export default { searchBooks, fetchAllBooks }
