import React, { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'
import { toast } from 'sonner'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function RequireAdmin() {
  const checkSession = useAdminStore((s) => s.checkSession)
  const admin = useAdminStore((s) => s.admin)
  const authLoading = useAdminStore((s) => s.authLoading)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    const ensure = async () => {
      const data = await checkSession()
      if (!data && mounted) {
        toast.warn('Please login to access admin')
        navigate('/admin/login', { state: { from: location }, replace: true })
      }
    }
    ensure()
    return () => (mounted = false)
  }, [checkSession, navigate, location])

  if (authLoading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/30 backdrop-blur">
        <div className="p-6 rounded-xl bg-white/10 glass">Loading...</div>
      </div>
    )
  }

  if (!admin) return null // redirect handled in effect

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
