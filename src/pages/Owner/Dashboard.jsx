import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useOwnerStore from '../../store/ownerStore'
import WhatsAppInput from '../../components/WhatsAppInput'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import RequireOwner from '../../components/RequireOwner'
import { toast } from 'sonner'

export default function Dashboard() {
  const owner = useOwnerStore((s) => s.owner)
  const isAuthenticated = useOwnerStore((s) => s.isAuthenticated)
  const logout = useOwnerStore((s) => s.logout)
  const fetchBooks = useOwnerStore((s) => s.fetchBooks)
  const books = useOwnerStore((s) => s.books)
  const uploadBook = useOwnerStore((s) => s.uploadBook)
  const updateBook = useOwnerStore((s) => s.updateBook)
  const deleteBook = useOwnerStore((s) => s.deleteBook)
  const loading = useOwnerStore((s) => s.loading)

  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  // category removed; use format/description instead
  // use 'ebook' as default
  const [format, setFormat] = useState('ebook')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('NGN')
  const [ownerWhatsApp, setOwnerWhatsApp] = useState('')
  const [cover, setCover] = useState(null)
  const [validationError, setValidationError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bioDraft, setBioDraft] = useState('')

  useEffect(() => {
    if (isAuthenticated) fetchBooks()
  }, [isAuthenticated])

  // initialize ownerWhatsApp from owner profile when available
  useEffect(() => {
    if (owner?.whatsappNumber) setOwnerWhatsApp(owner.whatsappNumber)
    if (owner?.bio) setBioDraft(owner.bio)
  }, [owner])

  if (!isAuthenticated) return <Navigate to="/owner/login" replace />

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      // Redirect home regardless of logout outcome to avoid leaving user on protected page
      navigate('/')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    // Client-side validation to avoid unnecessary server errors
    setValidationError('')
    if (!title || !title.trim()) {
      setValidationError('Title is required')
      return
    }
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
      setValidationError('Provide a valid price')
      return
    }
    if (!format) {
      setValidationError('Select a book format')
      return
    }
    if (!currency) {
      setValidationError('Select a currency')
      return
    }
    if (!cover && !editingId) {
      setValidationError('Please select a cover image')
      return
    }
    const fd = new FormData()
    fd.append('title', title)
    if (author) fd.append('author', author)
    fd.append('price', price)
    fd.append('currency', currency)
    fd.append('format', format)
    if (cover) {
      // backend may accept either 'image' or 'coverImage'
      fd.append('image', cover)
      fd.append('coverImage', cover)
    }
    if (description) fd.append('description', description)
    if (ownerWhatsApp) fd.append('ownerWhatsApp', ownerWhatsApp)
    // Log the FormData fields for debugging (files show name and size)
    try {
      console.groupCollapsed('Uploading book - FormData contents')
      for (const [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`)
        } else {
          console.log(`${key}:`, value)
        }
      }
      console.groupEnd()

      let result
      if (editingId) {
        // Update existing book via store (uses axios and withCredentials)
        result = await updateBook(editingId, fd)
        if (!result || !result.success) throw new Error(result?.message || 'Update failed')
        toast.success('Book updated')
      } else {
        result = await uploadBook(fd)
        if (!result || !result.success) throw new Error(result?.message || 'Upload failed')
        toast.success('Book uploaded')
      }

      // refresh books and clear modal state
      fetchBooks()
      setOpen(false)
      setEditingId(null)
      setTitle('')
      setPrice('')
      setAuthor('')
      setCover(null)
      setValidationError('')
    } catch (err) {
      const message = err?.message || 'Upload/Update failed'
      toast.error(message)
      console.error('Upload/Update error:', err)
    }
  }

  const handleEdit = (book) => {
    setTitle(book.title || '')
    setAuthor(book.author || '')
    setPrice(book.price || '')
    setFormat(book.format || 'ebook')
    setCurrency(book.currency || 'NGN')
    setDescription(book.description || '')
    setOwnerWhatsApp(book.ownerWhatsApp || '')
    setCover(null)
    setEditingId(book._id || book.id || null)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book? This action cannot be undone.')) return
    try {
      const result = await deleteBook(id)
      if (!result || !result.success) throw new Error(result?.message || 'Delete failed')
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Delete failed')
    }
  }

  return (
    <RequireOwner>
      <Navbar />
      <div className="min-h-screen card px-3 sm:px-6 pt-4 sm:pt-8 pb-24">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-6">
        <div className="flex items-start gap-4">
          {/* avatar */}
          {(() => {
            const p = owner?.profileImage
            let src = ''
            if (p) {
              if (typeof p === 'string') {
                src = p.startsWith('local:') ? `http://localhost:5001/uploads/${p.replace(/^local:/, '')}` : p
              } else if (p.url) src = p.url
            }
            return src ? (
              <img src={src} alt="owner avatar" className="h-16 w-16 rounded-full object-cover border" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-sm text-slate-600">IMG</div>
            )
          })()}
          <div>
            <h1 className="text-2xl font-semibold">{owner?.name || 'Owner'}</h1>
            <p className="text-sm text-gray-600">{owner?.storeName || owner?.type?.toUpperCase() || ''}</p>
            {owner?.bio && !editingBio && <p className="mt-2 text-sm text-gray-700 max-w-xl">{owner.bio}</p>}
            {/* Edit bio area */}
            {editingBio ? (
              <div className="mt-2 max-w-xl">
                <textarea value={bioDraft || ''} onChange={(e) => setBioDraft(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
                <div className="mt-2 flex gap-2">
                  <button onClick={async () => {
                    try {
                      const result = await useOwnerStore.getState().updateProfile({ bio: bioDraft });
                      if (!result || !result.success) throw new Error(result?.message || 'Update failed')
                      toast.success('Bio updated')
                      setEditingBio(false)
                    } catch (err) {
                      toast.error(err?.message || 'Update failed')
                    }
                  }} className="px-3 py-1 bg-sky-600 text-white rounded text-sm">Save</button>
                  <button onClick={() => { setBioDraft(owner?.bio || ''); setEditingBio(false) }} className="px-3 py-1 border rounded text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <button onClick={() => setEditingBio(true)} className="text-xs text-sky-600">Edit Bio</button>
              </div>
            )}
            <div className="mt-2 text-xs text-slate-600">
              {owner?.whatsappNumber && <span className="mr-3">WhatsApp: {owner.whatsappNumber}</span>}
              {owner?.email && <span>Email: {owner.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">Total Books: <strong>{books?.length || 0}</strong></div>
          <div className="hidden sm:block">
            <button onClick={() => setOpen(true)} className="bg-sky-600 text-white px-3 py-2 rounded">Upload Book</button>
          </div>
          <button onClick={handleLogout} className="border px-3 py-2 rounded">Logout</button>
        </div>
      </header>

      <main>
        {books?.length === 0 ? (
          <div className="text-center text-gray-600">No books uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <div key={b._id || b.id || b.title} className="bg-white rounded shadow p-3">
                {b.coverImage ? (
                  // Append a cache-busting query param based on updatedAt so browsers reload the image after updates
                  <img src={`${b.coverImage}${b.updatedAt ? `?t=${new Date(b.updatedAt).getTime()}` : `?t=${Date.now()}`}`} alt={b.title} className="h-96 w-full object-cover rounded" />
                ) : (
                  <div className="h-96 w-full bg-slate-100 flex items-center justify-center rounded">No Image</div>
                )}
                <h4 className="mt-2 font-medium">{b.title}</h4>
                {b.author && <div className="text-sm text-gray-700">By {b.author}</div>}
                <div className="text-sm text-gray-600">{b.currency || 'NGN'} {b.price}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => handleEdit(b)} className="px-2 py-1 bg-amber-500 text-white rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(b._id || b.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md mx-3 sm:mx-0 p-5 sm:p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Upload Book</h3>
            <form onSubmit={handleUpload} className="space-y-3">
                {validationError && <div className="text-sm text-red-600">{validationError}</div>}
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Author</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Author name (optional)" />
              </div>
              <div>
                <label className="block text-sm mb-1">Price (NGN)</label>
                <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border px-3 py-2 rounded">
                    <option value="ebook">eBook</option>
                    <option value="audiobook">Audio Book</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border px-3 py-2 rounded">
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Owner WhatsApp</label>
                  <WhatsAppInput value={ownerWhatsApp} onChange={(val) => setOwnerWhatsApp(val)} defaultCountry="NG" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={(e)=>setCover(e.target.files[0])} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={()=>setOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded">{loading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mobile full-width Add Book button fixed above the footer (safe-area aware) */}
      <div className="sm:hidden fixed left-4 right-4 z-50" style={{ bottom: 'calc(1.25rem + 30px + env(safe-area-inset-bottom))' }}>
        <button onClick={() => setOpen(true)} className="w-full bg-sky-600 text-white py-3 rounded-lg shadow-lg">Add Book</button>
      </div>
      </div>
      <Footer />
    </RequireOwner>
  )
}
