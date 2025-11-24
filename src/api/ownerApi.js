// Owner backend API helpers for theme persistence
export const getOwnerBase = () => {
  return import.meta.env.VITE_OWNER_BACKEND_URL || window.location.origin.replace(/:\d+$/, ':5001')
}

export const getTheme = async () => {
  const base = getOwnerBase().replace(/\/$/, '')
  const res = await fetch(`${base}/api/internal/theme`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch owner theme')
  return res.json()
}

export const setTheme = async (themeMode) => {
  const base = getOwnerBase().replace(/\/$/, '')
  const res = await fetch(`${base}/api/internal/theme-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ themeMode }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`owner setTheme failed: ${res.status} ${txt}`)
  }
  return res.json()
}
