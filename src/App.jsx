import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BooksPage from './components/books/BooksPage'
import Footer from './components/Footer'
import RequireAdmin from './components/admin/RequireAdmin'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-stone-900">
      <Navbar />
      <BooksPage />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<RequireAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<div className="p-6">Orders (coming soon)</div>} />
          <Route path="customers" element={<div className="p-6">Customers (coming soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
