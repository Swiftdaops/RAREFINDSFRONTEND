import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Make main scrollable and reserve space for the fixed footer (approx 80px) */}
      <main className="flex-1 overflow-auto ">{children}</main>
      <Footer />
    </div>
  )
}
