import React, { useState, useEffect, useCallback } from 'react'
import { searchBooks } from '../lib/dataService'
import { Search, Loader2, BookOpen, ExternalLink } from 'lucide-react'

import { buildWhatsAppOrderUrl } from '../lib/utils/whatsapp'
// --- Shared Utility Functions (minimal, local to this page) ---
const getBookTitle = (book) => book?.title || book?.name || 'Untitled'

const BookCard = ({ book }) => {
  const handleOrderClick = () => {
    window.open(buildWhatsAppOrderUrl(book), '_blank')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      <div className="p-4 flex flex-col items-center text-center">
        <img
          src={book.coverUrl || 'https://placehold.co/120x180/94A3B8/FFFFFF?text=COVER'}
          alt={`Cover of ${book.title}`}
          className="w-28 h-40 object-cover rounded-md shadow-md mb-3"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x180/94A3B8/FFFFFF?text=COVER' }}
        />
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mt-2">{book.title}</h3>
        <p className="text-sm text-gray-500 italic mt-1">by {book.author}</p>
        <p className="text-xl font-bold text-indigo-600 mt-2">{book.price ? `₦${book.price}` : 'N/A'}</p>
      </div>
      <button
        onClick={handleOrderClick}
        className="w-full py-2 bg-green-500 text-white font-medium hover:bg-green-600 transition duration-150 flex items-center justify-center text-sm"
      >
        Order via WhatsApp <ExternalLink className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}

export default function PublicBooksPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const performSearch = useCallback(async (q) => {
    if (!q) {
      setResults([])
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await searchBooks(q)
      setResults(data || [])
      if (Array.isArray(data) && data.length > 0 && String(data[0].id || data[0]._id || '').startsWith('m')) {
        setError('Backend search endpoint missing — showing mock data')
      }
    } catch (err) {
      setError('Search failed — see console for details')
      setResults([])
      // eslint-disable-next-line no-console
      console.error('PublicBooksPage search error', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query.length < 2) return setResults([])
    const id = setTimeout(() => performSearch(query), 300)
    return () => clearTimeout(id)
  }, [query, performSearch])

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 p-4 sm:p-8 font-sans">
      <header className="text-center py-6 bg-white dark:bg-stone-950 shadow-lg rounded-xl mb-8">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-white flex items-center justify-center">
          <BookOpen className="w-7 h-7 mr-2 text-stone-800 dark:text-white" /> Public Book Search
        </h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-300">Search for books using the local API; falls back to mock data.</p>
      </header>

      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full p-4 pl-12 border-2 border-stone-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-500 transition bg-white dark:bg-stone-900 text-stone-800 dark:text-white"
            disabled={loading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-stone-400" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto">
        {loading && query.length >= 2 && (
          <div className="flex items-center justify-center p-6 text-stone-800 dark:text-white">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> Searching for "{query}"...
          </div>
        )}

        {error && (
          <div className="bg-stone-100 dark:bg-stone-800 border-l-4 border-stone-700 dark:border-stone-300 text-stone-700 dark:text-white p-4 mb-6 rounded-lg shadow-md">
            <p className="font-bold">Notice</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((b) => (
              <BookCard key={b.id || b._id} book={b} />
            ))}
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && !error && (
          <div className="text-center text-stone-500 dark:text-stone-300 p-10">
            <p className="text-xl">No results found for "{query}".</p>
            <p className="text-sm mt-2">Try a different search term.</p>
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center text-stone-400 dark:text-stone-300 p-10">
            <p className="text-lg">Start typing at least two characters to search the catalog.</p>
          </div>
        )}
      </main>
    </div>
  )
}
