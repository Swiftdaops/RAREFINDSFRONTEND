import { create } from 'zustand'
import { api as http } from '../api/httpClient'
import { toast } from 'sonner'

const useAdminStore = create((set, get) => ({
  admin: null,
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

  login: async (username, password) => {
    try {
      set({ authLoading: true })
      const res = await http.post('/api/admin/login', { username, password })
      // Successful login sets cookie; now fetch admin profile
      const { data } = await http.get('/api/admin/me')
      set({ admin: data.admin, authLoading: false })
      toast.success(res?.data?.message || 'Logged in')
      return true
    } catch (err) {
      set({ authLoading: false })
      const status = err?.response?.status
      let message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Login failed'
      if (status === 401) message = 'Invalid admin credentials'
      toast.error(message)
      return false
    }
  },

  logout: async () => {
    try {
      await http.post('/api/admin/logout')
    } catch (err) {
      // ignore
    }
    set({ admin: null })
    toast.success('Logged out')
  },

  checkSession: async () => {
    try {
      set({ authLoading: true })
      const { data } = await http.get('/api/admin/me')
      set({ admin: data.admin, authLoading: false })
      return data.admin
    } catch (err) {
      set({ admin: null, authLoading: false })
      return null
    }
  },

  fetchEbooks: async () => {
    try {
      const { data } = await http.get('/api/ebooks')
      set({ ebooks: data })
      return data
    } catch (err) {
      toast.error('Failed to load ebooks')
      return []
    }
  },

  createEbook: async (formData) => {
    try {
      await http.post('/api/ebooks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Book added')
      await get().fetchEbooks()
      get().closeModal()
      return true
    } catch (err) {
      const message = err?.response?.data?.message || 'Add failed'
      toast.error(message)
      return false
    }
  },

  updateEbook: async (id, formData) => {
    try {
      await http.put(`/api/ebooks/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Book updated')
      await get().fetchEbooks()
      get().closeModal()
      return true
    } catch (err) {
      const message = err?.response?.data?.message || 'Update failed'
      toast.error(message)
      return false
    }
  },

  deleteEbook: async (id) => {
    try {
      await http.delete(`/api/ebooks/${id}`)
      toast.success('Book deleted')
      await get().fetchEbooks()
      return true
    } catch (err) {
      toast.error('Delete failed')
      return false
    }
  },

  openAddModal: () => set({ modalOpen: true, modalMode: 'add', selectedBook: null }),
  openEditModal: (book) => set({ modalOpen: true, modalMode: 'edit', selectedBook: book }),
  closeModal: () => set({ modalOpen: false, selectedBook: null }),
}))

export default useAdminStore
