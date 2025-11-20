import React from 'react'
import { NavLink } from 'react-router-dom'
import { useOwnerStore } from '@/store/ownerStore'
import { FiX } from 'react-icons/fi'

export default function OwnersSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`

  const sidebarOpen = useOwnerStore((s) => s.sidebarOpen)
  const toggleSidebar = useOwnerStore((s) => s.toggleSidebar)
  const owner = useOwnerStore((s) => s.owner)

  return (
    <>
      {/* Backdrop for mobile when sidebar is open with fade animation */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 sm:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleSidebar()}
        aria-hidden={sidebarOpen ? 'false' : 'true'}
      />

      <aside
        id="owner-sidebar"
        className={`z-40 sm:static fixed top-0 left-0 h-full w-64 p-4 theme glass transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-hidden={sidebarOpen ? 'false' : 'true'}
        aria-label="Owner navigation sidebar"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-3">
          <div className="text-sm font-semibold truncate max-w-40">{owner?.storeName || 'Your Store'}</div>
          {/* Close button (mobile only) */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            aria-controls="owner-sidebar"
            className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-slate-800 dark:text-slate-100 backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/owner/dashboard" end className={linkClass} onClick={() => sidebarOpen && toggleSidebar()}>
            Overview
          </NavLink>
          <NavLink to="/owner/products" className={linkClass} onClick={() => sidebarOpen && toggleSidebar()}>
            Products
          </NavLink>
        </nav>
      </aside>
    </>
  )
}
