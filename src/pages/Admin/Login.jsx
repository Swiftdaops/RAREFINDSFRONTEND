import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'
import { motion } from 'framer-motion'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const login = useAdminStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const onSubmit = async (vals) => {
    const ok = await login(vals.username, vals.password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-100 to-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-xl glass shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Admin Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            className="w-full px-3 py-2 rounded border"
            placeholder="Username"
            {...register('username', { required: true })}
          />
          <input
            type="password"
            className="w-full px-3 py-2 rounded border"
            placeholder="Password"
            {...register('password', { required: true })}
          />
          <button className="w-full py-2 rounded bg-blue-600 text-white">Sign In</button>
        </form>
      </motion.div>
    </div>
  )
}
