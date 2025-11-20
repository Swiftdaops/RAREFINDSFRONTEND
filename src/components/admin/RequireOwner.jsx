// src/components/owner/RequireOwner.jsx
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useOwnerStore from '@/store/ownerStore'
import { toast } from 'sonner'

export default function RequireOwner() {
  const [checking, setChecking] = useState(true)
  const checkSession = useOwnerStore((s) => s.checkSession)
  const navigate = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    let mounted = true

    async function ensure() {
      try {
        const owner = await checkSession()
        if (!mounted) return

        if (!owner) {
          toast.error('Owner login required', {
            description: 'Please sign in to manage your bookstore.',
          })
          navigate('/owner/login', {
            replace: true,
            state: { from: loc.pathname },
          })
        }
      } catch (err) {
        console.error('RequireOwner check failed:', err)
        navigate('/owner/login', { replace: true })
      } finally {
        if (mounted) setChecking(false)
      }
    }

    ensure()

    return () => {
      mounted = false
    }
  }, [checkSession, navigate, loc.pathname])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xs text-slate-400">
        Checking owner session…
      </div>
    )
  }

  return <Outlet />
}
