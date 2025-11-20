import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useOwnerStore } from '@/store/ownerStore'
import { FiMenu, FiX } from 'react-icons/fi'

export default function OwnersHeader() {
  const owner = useOwnerStore((s) => s.owner)
  const logout = useOwnerStore((s) => s.logout)
  const navigate = useNavigate()
  const sidebarOpen = useOwnerStore((s) => s.sidebarOpen)
  const toggleSidebar = useOwnerStore((s) => s.toggleSidebar)

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-3 py-3 sm:px-4 theme backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/60 shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300/60 dark:border-slate-700/70 text-slate-700 dark:text-slate-200 sm:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <FiX className="h-5 w-5 transition-transform duration-200" />
          ) : (
            <FiMenu className="h-5 w-5 transition-transform duration-200" />
          )}
        </button>
        <h1 className="truncate text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {owner?.storeName || 'Owner Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-xs font-medium text-slate-600 dark:text-slate-300 sm:block max-w-40 truncate">
          {owner?.email || owner?.storeName || 'Owner'}
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
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
