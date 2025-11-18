import React, { useEffect } from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminSidebar from '../../components/admin/AdminSidebar'
import useAdminStore from '../../store/adminStore'

export default function Dashboard() {
  const fetchEbooks = useAdminStore((s) => s.fetchEbooks)
  const ebooks = useAdminStore((s) => s.ebooks)

  useEffect(() => {
    fetchEbooks()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="flex gap-6 p-6">
        <AdminSidebar />
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass">Total Books
              <div className="text-2xl font-bold">{ebooks.length}</div>
            </div>
            <div className="p-4 rounded-xl glass">Coming Soon
              <div className="text-2xl font-bold">—</div>
            </div>
            <div className="p-4 rounded-xl glass">Revenue
              <div className="text-2xl font-bold">₦0</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
