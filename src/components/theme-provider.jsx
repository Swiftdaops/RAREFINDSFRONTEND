import React, { createContext, useContext, useEffect, useState } from 'react'
import * as ownerApi from '../api/ownerApi'

const ThemeProviderContext = createContext({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme', ...props }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(storageKey) || defaultTheme)

  // Apply theme classes to <html>
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const apply = () => {
        root.classList.remove('light', 'dark')
        root.classList.add(mq.matches ? 'dark' : 'light')
      }
      apply()
      if (mq.addEventListener) mq.addEventListener('change', apply)
      else mq.addListener(apply)
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', apply)
        else mq.removeListener(apply)
      }
    }

    root.classList.add(theme)
    // Also update any existing `.card` elements so they visually match the theme.
    try {
      const cards = Array.from(document.querySelectorAll('.card'))
      if (theme === 'dark') {
        cards.forEach((el) => el.classList.add('card--dark'))
      } else {
        cards.forEach((el) => el.classList.remove('card--dark'))
      }
    } catch (e) {
      // ignore DOM errors during SSR/hydration
    }
  }, [theme])

  // Load persisted theme from owner backend first, fallback to admin backend
  useEffect(() => {
    let mounted = true
    let ownerSocket = null

    const applyServerTheme = (serverValue, source = 'unknown') => {
      if (!serverValue) return
      const val = String(serverValue)
      // Accept both { theme } and { themeMode } shapes
      const normalized = (val === 'dark' || val === 'light') ? val : null
      if (!normalized) return
      try {
        localStorage.setItem(storageKey, normalized)
        setThemeState(normalized)
        // log source so developers see when admin-originated updates arrive
        // eslint-disable-next-line no-console
        console.info('[theme] applying server theme', { theme: normalized, source })
      } catch (e) {
        // ignore storage errors
      }
    }

    ;(async () => {
      // Try owner backend persisted theme
      try {
        const ownerHost = import.meta.env.VITE_OWNER_BACKEND_URL || window.location.origin.replace(/:\d+$/, ':5001')
        const ownerUrl = `${ownerHost.replace(/\/$/, '')}/api/internal/theme`
        // eslint-disable-next-line no-console
        console.info('[theme] fetching owner persisted theme from', ownerUrl)
        const ownerResp = await fetch(ownerUrl, { credentials: 'include' })
        if (ownerResp && ownerResp.ok) {
          const ownerData = await ownerResp.json()
          const serverTheme = ownerData?.themeMode || ownerData?.theme || ownerData || null
          if (mounted && serverTheme) applyServerTheme(serverTheme, 'owner-fetch')
          if (serverTheme) return
        } else {
          // eslint-disable-next-line no-console
          console.info('[theme] owner persisted theme not available', ownerResp && ownerResp.status)
        }
      } catch (ownerErr) {
        // eslint-disable-next-line no-console
        console.info('[theme] owner internal fetch failed', ownerErr && ownerErr.message)
      }

      // No admin fallback — owner backend is authoritative for persisted theme
    })()

    // Setup owner Socket.IO listener for realtime updates
    ;(async () => {
      let io
      try {
        const mod = await import('socket.io-client')
        io = mod.io || mod.default || mod
      } catch (importErr) {
        // eslint-disable-next-line no-console
        console.warn('[theme] socket.io-client import failed', importErr && importErr.message)
        io = null
      }

      if (!io) return

      try {
        const ownerBase = import.meta.env.VITE_OWNER_BACKEND_URL || (window.location.origin.replace(/:\d+$/, ':5001'))
        // eslint-disable-next-line no-console
        console.info('[theme] connecting owner socket to', ownerBase)
        ownerSocket = io(ownerBase, { transports: ['websocket', 'polling'] })
        ownerSocket.on('connect', () => {
          // eslint-disable-next-line no-console
          console.info('[theme] owner socket connected')
        })
        ownerSocket.on('connect_error', (err) => {
          // eslint-disable-next-line no-console
          console.warn('[theme] owner socket connect_error', err && err.message)
        })
        ownerSocket.on('theme:update', (payload) => {
          const serverTheme = payload?.themeMode || payload?.theme || payload
          if (serverTheme) applyServerTheme(serverTheme, 'owner-socket')
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[theme] owner socket init failed', e && e.message)
      }
    })()

    return () => {
      mounted = false
      try {
        if (ownerSocket && ownerSocket.disconnect) ownerSocket.disconnect()
      } catch (e) {
        // ignore
      }
    }
  }, [storageKey])

  // Apply theme locally without attempting to persist to owner backend.
  const applyLocalTheme = (nextTheme) => {
    if (!nextTheme) return
    try {
      const normalized = String(nextTheme)
      if (!['light', 'dark', 'system'].includes(normalized)) return
      try { localStorage.setItem(storageKey, normalized) } catch (e) {}
      setThemeState(normalized)
      // apply document class immediately for responsiveness
      try {
        const isDark = String(normalized).toLowerCase() === 'dark'
        if (isDark) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      } catch (e) {}
    } catch (e) {
      // ignore
    }
  }

  // Setter that updates local state/localStorage and attempts to persist to owner backend
  const setTheme = async (nextTheme) => {
    try {
      const normalized = String(nextTheme)
      if (!['light', 'dark', 'system'].includes(normalized)) return
      localStorage.setItem(storageKey, normalized)
      setThemeState(normalized)

      // Persist to owner backend (this will emit to owner sockets)
      try {
        if (normalized === 'light' || normalized === 'dark') {
          await ownerApi.setTheme(normalized)
        }
      } catch (ownerErr) {
        // eslint-disable-next-line no-console
        console.warn('[theme] owner setTheme failed', ownerErr && ownerErr.message)
      }

      // no admin persist here — owner backend is authoritative for owner app
    } catch (err) {
      // ignore errors
    }
  }

  const value = { theme, themeMode: theme, setTheme, applyLocalTheme }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export default ThemeProvider