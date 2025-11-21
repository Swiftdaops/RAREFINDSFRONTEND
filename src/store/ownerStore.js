// src/store/ownerStore.js
import { create } from 'zustand'
import { api as http } from '../api/httpClient'
import { toast } from 'sonner'

export const useOwnerStore = create((set, get) => ({
  owner: null,
  authLoading: false,
  ebooks: [],
  sidebarOpen: true,
  modalOpen: false,
  modalMode: 'add',
  selectedBook: null,

  setAuthLoading: (v) => set({ authLoading: v }),

  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // 🟢 OWNER LOGIN (NOT admin)
  login: async (email, password) => {
    try {
      set({ authLoading: true })
      const cleanEmail = email ? email.trim() : ''
      const cleanPassword = password ? password.trim() : ''

      const res = await http.post('/api/owners/login', {
        email: cleanEmail,
        password: cleanPassword,
      })

      const owner = res?.data?.owner
      set({ owner, authLoading: false })

      toast.success(res?.data?.message || 'Welcome back', {
        description: owner?.storeName || 'Store owner logged in',
      })

      return true
    } catch (err) {
      set({ authLoading: false })
      const status = err?.response?.status
      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Login failed'

      if (status === 401) message = 'Invalid email or password'
      if (status === 403) {
        message =
          err?.response?.data?.message ||
          'Your account is not approved yet. Please wait for admin review.'
      }

      toast.error(message)
      return false
    }
  },

  logout: async () => {
    try {
      // optional backend route: POST /api/owners/logout
      await http.post('/api/owners/logout')
    } catch (err) {
      // ignore
    }
    set({ owner: null })
    toast.success('Logged out')
  },

  // 🧠 Check owner session (for RequireOwner)
  checkSession: async () => {
    try {
      set({ authLoading: true })
      const { data } = await http.get('/api/owners/me')
      set({ owner: data.owner, authLoading: false })
      return data.owner
    } catch (err) {
      set({ owner: null, authLoading: false })
      return null
    }
  },

  // 📚 OWNER EBOOKS – same endpoints as admin, but backend must scope by owner
  fetchEbooks: async () => {
    try {
      // unified endpoint (backend will scope by owner if needed)
      const { data } = await http.get('/api/ebooks')
      set({ ebooks: Array.isArray(data) ? data : [] })
      return data
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load your ebooks'
      toast.error(msg)
      return []
    }
  },

  // Backend will attach ownerId + whatsappNumber from owner profile
  createEbook: async (formData) => {
    try {
      // Do NOT manually set Content-Type: multipart/form-data; Axios does it with boundary
      const res = await http.post('/api/ebooks', formData)
      // backend returns { message, id } — refresh list to show new ebook
      await get().fetchEbooks()
      get().closeModal()
      toast.success(res?.data?.message || 'Book added to JOHNBOOKS')
      return true
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Add failed'
      toast.error(message)
      return false
    }
  },

  updateEbook: async (id, formData) => {
    try {
      // Do NOT manually set Content-Type: multipart/form-data; Axios does it with boundary
      const res = await http.put(`/api/ebooks/${id}`, formData)
      await get().fetchEbooks()
      get().closeModal()
      toast.success(res?.data?.message || 'Book updated')
      return true
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Update failed'
      toast.error(message)
      return false
    }
  },

  deleteEbook: async (id) => {
    try {
      // unified endpoint; backend will validate ownership
      const res = await http.delete(`/api/ebooks/${id}`)
      await get().fetchEbooks()
      toast.success(res?.data?.message || 'Book deleted')
      return true
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || 'Delete failed'
      toast.error(message)
      return false
    }
  },

  openAddModal: () =>
    set({ modalOpen: true, modalMode: 'add', selectedBook: null }),
  openEditModal: (book) =>
    set({ modalOpen: true, modalMode: 'edit', selectedBook: book }),
  closeModal: () => set({ modalOpen: false, selectedBook: null }),
}))

export default useOwnerStore
