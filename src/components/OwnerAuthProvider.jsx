import React, { useEffect } from 'react'
import useOwnerStore from '../store/ownerStore'

export default function OwnerAuthProvider({ children }) {
  const restoreSession = useOwnerStore((s) => s.restoreSession)
  const loading = useOwnerStore((s) => s.loading)

  useEffect(() => {
    // Restore session once on mount
    restoreSession()
  }, [restoreSession])

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/30 backdrop-blur">
        <div className="p-6 rounded-xl bg-white/10 glass">Loading session...</div>
      </div>
    )
  }

  return <>{children}</>
}
