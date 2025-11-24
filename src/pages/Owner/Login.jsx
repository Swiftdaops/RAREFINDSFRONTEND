import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useOwnerStore from '../../store/ownerStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useOwnerStore((s) => s.login)
  const loading = useOwnerStore((s) => s.loading)
  const error = useOwnerStore((s) => s.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      // if login succeeded, store will fetch books; navigate to dashboard
      const auth = useOwnerStore.getState().isAuthenticated
      if (auth) navigate('/owner/dashboard')
    } catch (err) {
      // errors are handled in store
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-stone-950">
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-white to-stone-50 dark:from-stone-900 dark:to-stone-800">
        <div className="max-w-md p-8">
          <h2 className="text-3xl font-semibold mb-2 text-stone-950 dark:text-white">Owner Dashboard</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">Sign in to manage your books and uploads.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-stone-900 p-6 rounded shadow">
          <h3 className="text-xl font-medium mb-4 text-stone-950 dark:text-white">Sign in</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-stone-700 dark:text-stone-300">Email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-950 dark:text-white px-3 py-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm mb-1 text-stone-700 dark:text-stone-300">Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-950 dark:text-white px-3 py-2 rounded" required />
            </div>
            {error && <div className="text-sm text-stone-700 dark:text-white">{error}</div>}
            <button disabled={loading} className="w-full bg-stone-900 dark:bg-stone-700 text-white py-2 rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
          <div className="mt-4 text-sm text-stone-600 dark:text-stone-300">
            Don't have an account? <Link to="/owner/register" className="underline text-stone-700 dark:text-stone-300">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
