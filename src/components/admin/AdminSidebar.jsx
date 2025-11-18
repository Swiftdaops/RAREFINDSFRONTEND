import React from 'react'
import { NavLink } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`

  const sidebarOpen = useAdminStore((s) => s.sidebarOpen)

  // On small screens, the sidebar should be toggleable. On >=sm show always.
  const mobileClass = sidebarOpen ? 'block' : 'hidden'

  return (
    <aside className={`${mobileClass} sm:block w-56 p-4 bg-white/10 glass`}>
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
        <NavLink to="/admin/customers" className={linkClass}>
          Customers
        </NavLink>
      </nav>
    </aside>
  )
}
