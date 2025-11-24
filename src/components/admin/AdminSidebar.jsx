import React from 'react'
import { NavLink } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'

export default function AdminSidebar() {
  const linkClass = ({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'font-semibold' : ''}`

  const sidebarOpen = useAdminStore((s) => s.sidebarOpen)
  const admin = useAdminStore((s) => s.admin)

  const mobileClass = sidebarOpen ? 'block' : 'hidden'

  const avatar = admin?.profileImage || ''

  return (
    <aside className={`${mobileClass} sm:block w-56 p-4`}>
      <div className="mb-4 flex items-center gap-3">
        {avatar ? (
          (() => {
            const src = typeof avatar === 'string' && avatar.startsWith('local:') ? `http://localhost:5001/uploads/${avatar.replace(/^local:/, '')}` : avatar
            return <img src={src} alt="admin avatar" className="h-12 w-12 rounded-full object-cover" />
          })()
        ) : (
          <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm">A</div>
        )}
        <div>
          <div className="text-sm font-semibold">{admin?.name || admin?.username || 'Admin'}</div>
          <div className="text-xs">{admin?.email || ''}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>
      </nav>
    </aside>
  )
}
