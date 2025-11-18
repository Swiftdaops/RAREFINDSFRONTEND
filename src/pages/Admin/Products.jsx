import React, { useEffect, useMemo } from 'react'
import useAdminStore from '../../store/adminStore'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

function EbookCard({ book, onEdit, onDelete }) {
  return (
    <div className="p-4 rounded-xl glass shadow-sm flex flex-col">
      <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded" />
      <h3 className="mt-2 font-semibold">{book.title}</h3>
      <div className="text-sm text-slate-600">{book.author}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-bold">₦{book.price}</div>
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
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openAddModal}>
                Add Book
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ebooks.map((b) => (
              <EbookCard key={b._id} book={b} onEdit={(bk) => openEditModal(bk)} onDelete={handleDelete} />
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
      reset({ title: book.title, author: book.author, description: book.description, price: book.price })
    } else {
      reset({ title: '', author: '', description: '', price: '' })
    }
  }, [mode, book])

  const submit = async (vals) => {
    const fd = new FormData()
    fd.append('title', vals.title)
    fd.append('author', vals.author)
    fd.append('description', vals.description)
    fd.append('price', vals.price)
    const file = vals.coverImage && vals.coverImage[0]
    if (file) fd.append('coverImage', file)

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
