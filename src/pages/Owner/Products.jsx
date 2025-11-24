import React, { useEffect, useMemo, useState, useRef } from 'react'
import placeholderImg from '../../components/books/logo.png'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import useOwnerStore from '../../store/ownerStore'

function EbookCard({ book, onEdit, onDelete }) {
  const formatPrice = (p) => {
    if (p && typeof p === 'object') {
      const amt = p.amount ?? p.value ?? ''
      const cur = p.currency ?? ''
      return `${cur ? cur : '₦'}${amt}`
    }
    return `₦${p}`
  }

  const cover = book?.coverImage?.url || book?.coverUrl || placeholderImg

  useEffect(() => {
    console.debug('EbookCard cover resolved:', { id: book?._id || book?.id, cover })
  }, [cover, book])

  return (
    <div className="p-4 rounded-xl glass shadow-sm flex flex-col">
      <div className="w-full">
        <img
          src={cover}
          alt={book.title}
          className="w-full h-80 sm:h-96 md:h-[520px] object-contain rounded"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = placeholderImg
          }}
        />
      </div>

      <h3 className="mt-3 text-lg font-semibold line-clamp-2">{book.title}</h3>
      <div className="text-sm text-slate-600">{book.author}</div>

      <div className="mt-3 flex items-center justify-between">
        <div className="font-bold">{formatPrice(book.price)}</div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(book)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
          <button onClick={() => onDelete(book._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  )
}
export default function Products() {
  const fetchBooks = useOwnerStore((s) => s.fetchBooks)
  const books = useOwnerStore((s) => s.books)
  const deleteBook = useOwnerStore((s) => s.deleteBook)
  const uploadBook = useOwnerStore((s) => s.uploadBook)
  const updateBook = useOwnerStore((s) => s.updateBook)
  const loading = useOwnerStore((s) => s.loading)
  const error = useOwnerStore((s) => s.error)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add') // add | edit
  const [selectedBook, setSelectedBook] = useState(null)

  const [query, setQuery] = useState('')

  const filteredBooks = useMemo(() => {
    if (!query || !query.trim()) return books || []
    const q = query.toLowerCase()
    return (books || []).filter((b) => {
      const title = (b.title || (b.raw && b.raw.title) || '').toString().toLowerCase()
      const author = (b.author || (b.raw && b.raw.author_name && b.raw.author_name[0]) || '').toString().toLowerCase()
      return title.includes(q) || author.includes(q)
    })
  }, [books, query])

  useEffect(() => {
    fetchBooks()
  }, [])

  function handleDelete(id) {
    if (window.confirm('Delete this book?')) deleteBook(id)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <main className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="px-3 py-2 rounded border w-64 text-sm"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setSelectedBook(null); setModalMode('add'); setModalOpen(true) }}>
                Add Book
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredBooks.map((b) => (
              <EbookCard key={b._id || b.id} book={b} onEdit={(bk) => { setSelectedBook(bk); setModalMode('edit'); setModalOpen(true) }} onDelete={handleDelete} />
            ))}
          </div>
        </main>
      </div>

      {modalOpen && (
        <EbookModal
          mode={modalMode}
          book={selectedBook}
          loading={loading}
          error={error}
          onClose={() => setModalOpen(false)}
          onCreate={async (fd) => { await uploadBook(fd); setModalOpen(false) }}
          onUpdate={async (id, fd) => { await updateBook(id, fd); setModalOpen(false) }}
        />
      )}

      <style>{`.addbooks{position:fixed;right:18px;bottom:18px}`}</style>
    </div>
  )
}

function EbookModal({ mode, book, loading, error, onClose, onCreate, onUpdate }) {
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm({
    mode: 'onChange',
    defaultValues: { title: '', author: '', description: '', price: '', coverImage: [], coverUrl: '', ownerWhatsApp: '' }
  })
  const isValid = formState?.isValid
  const owner = useOwnerStore((s) => s.owner)
  const saveKey = 'addBookForm_v1'
  const watchRef = useRef(null)
  const debounceRef = useRef(null)

    React.useEffect(() => {
    if (mode === 'edit' && book) {
      const priceVal =
        book && typeof book.price === 'object'
        ? (book.price.amount ?? book.price.value ?? '')
        : book.price

      const defaults = {
        title: book.title ?? '',
        author: book.author ?? '',
        description: book.description ?? '',
        price: priceVal ?? '',
        coverUrl: book.coverUrl || ''
      }

      const setDefaultsWithCover = async () => {
        if (book.coverUrl) {
        try {
          const res = await fetch(book.coverUrl)
          if (!res.ok) throw new Error('Failed to fetch cover image')
          const blob = await res.blob()
          const ext = (blob.type && blob.type.split('/')[1]) || 'jpg'
          const filename = (book.title ? book.title.replace(/\s+/g, '_') : 'cover') + '.' + ext
          const file = new File([blob], filename, { type: blob.type })
          reset({ ...defaults, coverImage: [file], coverUrl: book.coverUrl || '' })
          return
        } catch (err) {
          // If fetch fails, fall back to resetting without cover file
        }
        }
        reset({ ...defaults, coverImage: [], coverUrl: book.coverUrl || '' })
      }

      setDefaultsWithCover()
    } else {
      // For 'add' mode, preload any saved draft from localStorage and prefill owner's WhatsApp
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(saveKey) : null
      let parsed = null
      if (saved) {
        try {
          parsed = JSON.parse(saved)
        } catch (e) {
          parsed = null
        }
      }
      const defaults = Object.assign({ title: '', author: '', description: '', price: '', coverImage: [], coverUrl: '' }, parsed || {})
      // If owner has a whatsappNumber or phone-like field, prefill ownerWhatsApp unless draft provides it
      const ownerPhone = owner?.whatsappNumber || owner?.phone || owner?.whatsapp || ''
      if (!defaults.ownerWhatsApp && ownerPhone) defaults.ownerWhatsApp = ownerPhone
      reset(defaults)
    }
  }, [mode, book, reset, owner])

  const submit = async (vals) => {
    const fd = new FormData()
    fd.append('title', vals.title)
    fd.append('price', vals.price)
    fd.append('currency', 'NGN')
    fd.append('format', 'ebook')
    if (vals.author) fd.append('author', vals.author)
    if (vals.description) fd.append('description', vals.description)
    if (vals.ownerWhatsApp) fd.append('ownerWhatsApp', vals.ownerWhatsApp)
    const file = vals.coverImage && vals.coverImage[0]
    if (file) {
      fd.append('image', file)
    } else if (vals.coverUrl) {
      // If we support remote image url fallback
      fd.append('existingImageUrl', vals.coverUrl)
    }

    if (mode === 'add') {
      await onCreate(fd)
    } else if (mode === 'edit') {
      await onUpdate(book._id, fd)
    }
    // Clear persisted draft only after successful create/update
    try {
      if (mode === 'add') {
        if (typeof window !== 'undefined') window.localStorage.removeItem(saveKey)
      }
    } catch (e) {}
    reset()
  }

  // Persist form state to localStorage for 'add' mode
  useEffect(() => {
    if (mode !== 'add') return
    // watch all fields we care about
    watchRef.current = watch((value) => {
      // debounce writes to localStorage
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        try {
          const toSave = {
            title: value.title || '',
            author: value.author || '',
            description: value.description || '',
            price: value.price || '',
            coverUrl: value.coverUrl || '',
            // Do not attempt to serialize File objects; keep only ownerWhatsApp and coverUrl
            ownerWhatsApp: value.ownerWhatsApp || ''
          }
          if (typeof window !== 'undefined') window.localStorage.setItem(saveKey, JSON.stringify(toSave))
        } catch (e) {
          // ignore storage errors
        }
      }, 300)
    })
    return () => {
      if (watchRef.current && typeof watchRef.current === 'function') watchRef.current()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [mode, watch])

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg p-6 rounded-xl glass bg-white/80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'add' ? 'Add Book' : 'Edit Book'}</h3>
          <button onClick={onClose} className="text-slate-600">Close</button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <input className="w-full px-3 py-2 rounded border" placeholder="Title" {...register('title', { required: true })} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Author" {...register('author')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Price" {...register('price', { required: true })} />
          <textarea className="w-full px-3 py-2 rounded border" placeholder="Description" {...register('description')} />
          <input className="w-full px-3 py-2 rounded border" placeholder="WhatsApp number (owner)" {...register('ownerWhatsApp')} />
          <input type="file" {...register('coverImage')} />
          {error && <div className="text-xs text-red-600">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded">Cancel</button>
            {mode === 'add' && (
              <button type="button" onClick={() => {
                try {
                  if (typeof window !== 'undefined') window.localStorage.removeItem(saveKey)
                } catch (e) {}
                const ownerPhone = owner?.whatsappNumber || owner?.phone || owner?.whatsapp || ''
                reset({ title: '', author: '', description: '', price: '', coverImage: [], coverUrl: '', ownerWhatsApp: ownerPhone })
              }} className="px-3 py-2 rounded bg-gray-200">Clear draft</button>
            )}
            <button disabled={loading || !isValid} type="submit" className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">{loading ? 'Saving...' : (mode === 'add' ? 'Create' : 'Update')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
