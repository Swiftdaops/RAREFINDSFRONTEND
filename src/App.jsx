import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import OwnerLogin from './pages/Owner/Login'
import OwnerRegister from './pages/Owner/Register.jsx'
import OwnerDashboard from './pages/Owner/Dashboard'
// Use BooksPage as the homepage (includes SearchBar)
import BooksPage from './components/books/BooksPage'
import AppLayout from './layouts/AppLayout'
import RequireOwner from './components/RequireOwner'
import useOwnerStore from './store/ownerStore'

function App() {
  // restore owner session from httpOnly cookie (if present)
  // Session is restored at the app root by `OwnerAuthProvider`.
  // Keep App free of side-effectful session startup to avoid duplicate runs.

  return (
    <BrowserRouter>
      <Routes>
        {/* Owner routes only */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/owner/dashboard" element={<RequireOwner><OwnerDashboard /></RequireOwner>} />

        <Route path="/" element={<AppLayout><BooksPage /></AppLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
