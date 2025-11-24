import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useOwnerStore from '../store/ownerStore'
import { toast } from 'sonner'

export default function RequireOwner({ children }) {
  // Read reactive pieces from the store
  const isAuthenticated = useOwnerStore((s) => s.isAuthenticated)
  const loading = useOwnerStore((s) => s.loading)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const ensure = async () => {
      try {
        // Call restoreSession via getState() to avoid the function reference
        // changing and accidentally re-running this effect.
        await useOwnerStore.getState().restoreSession()
        const ok = useOwnerStore.getState().isAuthenticated
        if (!ok && mounted) {
          toast.warn('Please login to continue')
          navigate('/owner/login', { replace: true })
        }
      } catch (err) {
        if (mounted) {
          toast.warn('Please login to continue')
          navigate('/owner/login', { replace: true })
        }
      }
    }
    ensure()
    return () => (mounted = false)
  }, [navigate])

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/30 backdrop-blur">
        <div className="p-6 rounded-xl bg-white/10 glass">Loading...</div>
      </div>
    )
  }

  // If not authenticated, render nothing because effect will redirect
  if (!isAuthenticated) return null

  return <>{children}</>
}
