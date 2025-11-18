import React from 'react'
import useAdminStore from '../../store/adminStore'
import { FiMenu, FiX } from 'react-icons/fi'

export default function AdminHeader() {
  const admin = useAdminStore((s) => s.admin)
  const logout = useAdminStore((s) => s.logout)
  const sidebarOpen = useAdminStore((s) => s.sidebarOpen)
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar)

  return (
    <header className="flex items-center justify-between p-4 bg-white/20 backdrop-blur glass">
      <div className="flex items-center gap-3">
        {/* Hamburger for small screens */}
        <button
          className="p-2 rounded-md mr-2 sm:hidden"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">{admin?.username || 'Admin'}</div>
        <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}
