import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'
import { FiMenu, FiX } from 'react-icons/fi'

export default function AdminHeader() {
  const admin = useAdminStore((s) => s.admin)
  const logout = useAdminStore((s) => s.logout)
  const navigate = useNavigate()
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
        <div className="flex items-center gap-3">
          {admin?.profileImage ? (
            (() => {
              const p = admin.profileImage
              const src = typeof p === 'string' && p.startsWith('local:') ? `http://localhost:5001/uploads/${p.replace(/^local:/, '')}` : p
              return <img src={src} alt="admin avatar" className="h-8 w-8 rounded-full object-cover border" />
            })()
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">A</div>
          )}
          <div className="text-sm">{admin?.username || admin?.name || 'Admin'}</div>
        </div>
        <button
          className="px-3 py-1 rounded bg-red-500 text-white"
          onClick={async () => {
            await logout()
            navigate('/')
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
