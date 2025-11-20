import React, { useEffect, useMemo, useState } from 'react'
import placeholderImg from '../../components/books/logo.png'
import { useOwnerStore } from '@/store/ownerStore'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

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

  useEffect(() => {}, [cover, book])

  return (
    <div className="flex flex-col rounded-xl glass shadow-sm overflow-hidden">
      <div className="w-full overflow-hidden">
        <div className="aspect-3/4 w-full bg-gray-100 dark:bg-slate-900">
          <img
            src={cover}
            alt={book.title}
            className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = placeholderImg
            }}
          />
        </div>
      </div>

      <div className="p-3 flex flex-1 flex-col">
        <h3 className="text-sm font-semibold line-clamp-2 text-slate-800 dark:text-slate-100">{book.title}</h3>
        <div className="text-[12px] text-slate-500 mt-1">{book.author}</div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold text-sm">{formatPrice(book.price)}</div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(book)} className="px-2 py-1 bg-yellow-400 rounded text-sm">Edit</button>
            <button onClick={() => onDelete(book._id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function Products() {
  const { ebooks, fetchEbooks, createEbook, updateEbook, deleteEbook } = useOwnerStore()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    fetchEbooks()
  }, [fetchEbooks])

  const filteredEbooks = useMemo(() => {
    if (!query || !query.trim()) return ebooks || []
    const q = query.toLowerCase()
    return (ebooks || []).filter((b) => {
      const title = (b.title || (b.raw && b.raw.title) || '').toString().toLowerCase()
      const author = (b.author || (b.raw && b.raw.author_name && b.raw.author_name[0]) || '').toString().toLowerCase()
      return title.includes(q) || author.includes(q)
    })
  }, [ebooks, query])

  // Modal helpers & CRUD
  const openAddModal = () => {
    setSelectedBook(null)
    setModalMode('add')
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)

  const handleCreate = async (formData) => {
    const success = await createEbook(formData)
    if (success) closeModal()
  }

  const handleUpdate = async (id, formData) => {
    const success = await updateEbook(id, formData)
    if (success) closeModal()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return
    await deleteEbook(id)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Products</h2>

        <div className="flex items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="px-3 py-2 rounded border w-full max-w-xs text-sm"
          />
          <button className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white rounded" onClick={openAddModal}>
            Add Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEbooks.map((b) => (
          <EbookCard
            key={b._id || b.id}
            book={b}
            onEdit={(bk) => {
              setSelectedBook(bk)
              setModalMode('edit')
              setModalOpen(true)
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {modalOpen && (
        <EbookModal mode={modalMode} book={selectedBook} onClose={closeModal} onCreate={handleCreate} onUpdate={handleUpdate} />
      )}

      {/* Mobile floating Add button */}
      <button
        onClick={openAddModal}
        className="sm:hidden fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Add book"
      >
        +
      </button>
    </div>
  )
}

function EbookModal({ mode, book, onClose, onCreate, onUpdate }) {
  const { register, handleSubmit, reset } = useForm()

    React.useEffect(() => {
    if (mode === 'edit' && book) {
      const priceVal =
        book && typeof book.price === 'object'
        ? (book.price.amount ?? book.price.value ?? '')
        : book.price

      const coverUrl = book.coverImage?.url || book.coverUrl || ''

      const defaults = {
        title: book.title ?? '',
        author: book.author ?? '',
        description: book.description ?? '',
        price: priceVal ?? '',
        coverUrl: coverUrl
      }

      const setDefaultsWithCover = async () => {
        if (coverUrl) {
        try {
          const res = await fetch(coverUrl)
          if (!res.ok) throw new Error('Failed to fetch cover image')
          const blob = await res.blob()
          const ext = (blob.type && blob.type.split('/')[1]) || 'jpg'
          const filename = (book.title ? book.title.replace(/\s+/g, '_') : 'cover') + '.' + ext
          const file = new File([blob], filename, { type: blob.type })
          reset({ ...defaults, coverImage: [file], coverUrl: coverUrl })
          return
        } catch (err) {
          // If fetch fails, fall back to resetting without cover file
        }
        }
        reset({ ...defaults, coverImage: [], coverUrl: coverUrl })
      }

      setDefaultsWithCover()
    } else {
      reset({ title: '', author: '', description: '', price: '', coverImage: [], coverUrl: '' })
    }
  }, [mode, book, reset])

  const submit = async (vals) => {
    // Basic client-side validation to avoid sending bad requests
    if (!vals.title || !vals.author || !vals.price) {
      toast.error('Please provide title, author and price')
      return
    }

    const file = vals.coverImage && vals.coverImage[0]
    if (!file && !vals.coverUrl) {
      toast.error('Please attach a cover image file or provide a cover URL')
      return
    }

    const fd = new FormData()
    fd.append('title', vals.title)
    fd.append('author', vals.author)
    fd.append('description', vals.description || '')
    fd.append('price', vals.price)
    if (file) {
      fd.append('coverImage', file)
    } else if (vals.coverUrl) {
      fd.append('coverImageUrl', vals.coverUrl)
    }

    try {
      if (mode === 'add') {
        await onCreate(fd)
      } else if (mode === 'edit') {
        await onUpdate(book._id, fd)
      }
    } catch (err) {
      // bubble up (onCreate/onUpdate handle toasts) — ensure we log server response for debugging
      console.error('Submit error:', err?.response?.data || err)
      throw err
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg sm:max-w-md mx-3 p-4 sm:p-6 rounded-xl glass bg-white/90"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'add' ? 'Add Book' : 'Edit Book'}</h3>
          <button onClick={onClose} className="text-slate-600">Close</button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <input className="w-full px-3 py-2 rounded border" placeholder="Title" {...register('title', { required: true })} />
          <input className="w-full px-3 py-2 rounded border" placeholder="Author" {...register('author', { required: true })} />
          <textarea className="w-full px-3 py-2 rounded border" placeholder="Description" {...register('description')}></textarea>
          <input className="w-full px-3 py-2 rounded border" placeholder="Price" {...register('price', { required: true })} />
          <input type="file" {...register('coverImage')} />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{mode === 'add' ? 'Create' : 'Update'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
