import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BooksPage from './components/books/BooksPage'
import Footer from './components/Footer'
import RequireAdmin from './components/admin/RequireAdmin'
import RequireOwner from './components/admin/RequireOwner'
import OwnerLayout from './components/admin/owners/OwnerLayout'
import AdminLogin from './pages/Admin/Login'
import OwnerLogin from './pages/owners/Login'
import OwnerDashboard from './pages/owners/Dashboard'
import OwnerProducts from './pages/owners/Products'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'
import OwnerSignup from './pages/Admin/Signup'
import { ThemeProvider } from './components/theme-provider'
import { AppThemeListener } from './components/theme/AppThemeListener'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-stone-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* The BooksPage remains the homepage content; other public pages can be added as routes */}
        <BooksPage />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppThemeListener />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Owner login routes: support both /owners/login and /owner/login */}
          <Route path="/owners/login" element={<OwnerLogin />} />
          <Route path="/owner/login" element={<OwnerLogin />} />

          {/* Owner-protected routes */}
          <Route element={<RequireOwner />}> 
            <Route path="/owner" element={<OwnerLayout />}>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="products" element={<OwnerProducts />} />
            </Route>
          </Route>
          <Route path="/owners/signup" element={<OwnerSignup />} />
          <Route path="/partner/signup" element={<OwnerSignup />} />

          <Route path="/admin" element={<RequireAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<div className="p-6">Orders (coming soon)</div>} />
            <Route path="customers" element={<div className="p-6">Customers (coming soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
