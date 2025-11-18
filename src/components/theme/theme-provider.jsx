import React from 'react'

export default function ThemeProvider({ children }) {
  return <div className="antialiased text-slate-900">{children}</div>
}
