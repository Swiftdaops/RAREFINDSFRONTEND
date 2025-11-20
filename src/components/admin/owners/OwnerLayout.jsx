import React from 'react'
import { Outlet } from 'react-router-dom'
import OwnersHeader from './OwnersHeader'
import OwnersSidebar from './OwnersSidebar'
import Footer from '../../Footer'

export default function OwnerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <OwnersHeader />

      <div className="flex flex-1 gap-6 p-4 sm:p-6">
        <OwnersSidebar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
