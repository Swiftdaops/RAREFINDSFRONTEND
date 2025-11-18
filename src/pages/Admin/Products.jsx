import React, { useEffect, useMemo, useState } from 'react'
import placeholderImg from '../../components/books/logo.png'
import useAdminStore from '../../store/adminStore'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

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
  const fetchEbooks = useAdminStore((s) => s.fetchEbooks)
  const ebooks = useAdminStore((s) => s.ebooks)
  const deleteEbook = useAdminStore((s) => s.deleteEbook)
  const openAddModal = useAdminStore((s) => s.openAddModal)
  const openEditModal = useAdminStore((s) => s.openEditModal)
  const modalOpen = useAdminStore((s) => s.modalOpen)
  const modalMode = useAdminStore((s) => s.modalMode)
  const selectedBook = useAdminStore((s) => s.selectedBook)
  const createEbook = useAdminStore((s) => s.createEbook)
  const updateEbook = useAdminStore((s) => s.updateEbook)
  const closeModal = useAdminStore((s) => s.closeModal)

  const [query, setQuery] = useState('')

  const filteredEbooks = useMemo(() => {
    if (!query || !query.trim()) return ebooks || []
    const q = query.toLowerCase()
    return (ebooks || []).filter((b) => {
      const title = (b.title || (b.raw && b.raw.title) || '').toString().toLowerCase()
      const author = (b.author || (b.raw && b.raw.author_name && b.raw.author_name[0]) || '').toString().toLowerCase()
      return title.includes(q) || author.includes(q)
    })
  }, [ebooks, query])

  useEffect(() => {
    fetchEbooks()
  }, [])

  function handleDelete(id) {
    if (window.confirm('Delete this book?')) deleteEbook(id)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="flex gap-6 p-6">
        <AdminSidebar />
        <main className="flex-1">
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openAddModal}>
                Add Book
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEbooks.map((b) => (
              <EbookCard key={b._id || b.id} book={b} onEdit={(bk) => openEditModal(bk)} onDelete={handleDelete} />
            ))}
          </div>
        </main>
      </div>

      {modalOpen && (
        <EbookModal
          mode={modalMode}
          book={selectedBook}
          onClose={closeModal}
          onCreate={createEbook}
          onUpdate={updateEbook}
        />
      )}

      <style>{`.addbooks{position:fixed;right:18px;bottom:18px}`}</style>
    </div>
  )
}

function EbookModal({ mode, book, onClose, onCreate, onUpdate }) {
  const { register, handleSubmit, reset } = useForm()

  React.useEffect(() => {
    if (mode === 'edit' && book) {
      // Ensure price reset is a primitive string/number; handle object shape {amount,currency}
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

      // Fetch cover image URL and convert to a File so the form can have the existing image as a file value
      const setDefaultsWithCover = async () => {
        if (book.coverUrl) {
        try {
          const res = await fetch(book.coverUrl)
          if (!res.ok) throw new Error('Failed to fetch cover image')
          const blob = await res.blob()
          const ext = (blob.type && blob.type.split('/')[1]) || 'jpg'
          const filename = (book.title ? book.title.replace(/\s+/g, '_') : 'cover') + '.' + ext
          const file = new File([blob], filename, { type: blob.type })
          // reset with coverImage as array containing the File (react-hook-form will expose this in vals.coverImage)
          reset({ ...defaults, coverImage: [file], coverUrl: book.coverUrl || '' })
          return
        } catch (err) {
          // If fetch fails, fall back to resetting without cover file
          // console.warn(err)
        }
        }
        reset({ ...defaults, coverImage: [], coverUrl: book.coverUrl || '' })
      }

      setDefaultsWithCover()
    } else {
      reset({ title: '', author: '', description: '', price: '', coverImage: [], coverUrl: '' })
    }
  }, [mode, book, reset])

  const submit = async (vals) => {
    const fd = new FormData()
    fd.append('title', vals.title)
    fd.append('author', vals.author)
    fd.append('description', vals.description)
    fd.append('price', vals.price)
    const file = vals.coverImage && vals.coverImage[0]
    if (file) {
      fd.append('coverImage', file)
    } else if (vals.coverUrl) {
      // backend expects `coverImageUrl` when no file is uploaded
      fd.append('coverImageUrl', vals.coverUrl)
    }

    if (mode === 'add') {
      await onCreate(fd)
    } else if (mode === 'edit') {
      await onUpdate(book._id, fd)
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg p-6 rounded-xl glass">
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
