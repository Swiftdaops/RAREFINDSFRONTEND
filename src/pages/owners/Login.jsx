import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useOwnerStore } from '@/store/ownerStore'
import { toast } from 'sonner'

export default function OwnerLogin() {
  const { register, handleSubmit, formState } = useForm()
  const login = useOwnerStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = async ({ email, password }) => {
    const ok = await login(email, password)
    if (ok) {
      navigate('/owner/dashboard')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center   text-stone-950 ">
      <div className="w-full max-w-md p-6 rounded-xl bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">Owner Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              {...register('email', { required: true })}
              type="email"
              placeholder="owner@example.com"
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={formState.isSubmitting}
            />
          </label>

          <label className="block">
            <span className="text-sm">Password</span>
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Password"
              className="mt-1 w-full rounded border px-3 py-2"
              disabled={formState.isSubmitting}
            />
          </label>

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full rounded card px-4 py-2  disabled:opacity-60"
          >
            {formState.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
