import React from 'react'
import useAdminStore from '../../store/adminStore'

export default function AdminHeader() {
  const admin = useAdminStore((s) => s.admin)
  const logout = useAdminStore((s) => s.logout)

  return (
    <header className="flex items-center justify-between p-4 bg-white/20 backdrop-blur glass">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm">{admin?.username || 'Admin'}</div>
        <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}
