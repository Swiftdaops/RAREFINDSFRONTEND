import React, { useState, useEffect, useRef } from 'react'
import useOwnerStore from '../../store/ownerStore'
import { z } from 'zod'
import { normalizeToE164, validateWhatsAppNumber } from '../../lib/utils/phone'
import WhatsAppInput from '../../components/WhatsAppInput'

export default function Register() {
  const signup = useOwnerStore((s) => s.signup)
  const loading = useOwnerStore((s) => s.loading)
  const signupSuccess = useOwnerStore((s) => s.signupSuccess)
  const error = useOwnerStore((s) => s.error)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [type, setType] = useState('author')
  const [storeName, setStoreName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [validationError, setValidationError] = useState('')
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState('')
  const fileInputRef = useRef(null)

  // persist form state so a refresh doesn't lose user input
  const STORAGE_KEY = 'owner_register_form'
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
          if (parsed.name) setName(parsed.name)
          if (parsed.username) setUsername(parsed.username)
          if (parsed.email) setEmail(parsed.email)
          if (parsed.password) setPassword(parsed.password)
          if (parsed.bio) setBio(parsed.bio)
          if (parsed.type) setType(parsed.type)
          if (parsed.storeName) setStoreName(parsed.storeName)
          if (parsed.whatsappNumber) setWhatsappNumber(parsed.whatsappNumber)
        // profileImage is not persisted in localStorage
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    const payload = { name, username, email, password, bio, type, storeName, whatsappNumber }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
      // ignore
    }
  }, [name, username, email, password, bio, type, storeName, whatsappNumber])

  useEffect(() => {
    if (!profileImageFile) {
      setProfilePreview('')
      return
    }
    const url = URL.createObjectURL(profileImageFile)
    setProfilePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [profileImageFile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate with zod and phone utilities before sending to backend
    setValidationError('')
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
      username: z.string().optional(),
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      type: z.enum(['author', 'bookstore']),
      bio: z.string().optional(),
      storeName: z.string().optional(),
      whatsappNumber: z.string().optional()
    })

    const data = { name, username, email, password, bio, type, storeName, whatsappNumber }
    try {
      schema.parse(data)
      // normalize whatsapp if provided
      let normalizedWhatsApp = ''
      if (whatsappNumber) {
        normalizedWhatsApp = normalizeToE164(whatsappNumber, 'NG')
        const check = validateWhatsAppNumber(normalizedWhatsApp, 'NG')
        if (!check.valid) {
          throw new Error(check.reason === 'invalid_length' ? `WhatsApp number looks wrong (local should be ${check.details?.expectedLocal || 10} digits)` : 'Invalid WhatsApp number')
        }
      }

      await signup({ name, username, email, password, bio, type, storeName, whatsappNumber: normalizedWhatsApp, profileImage: profileImageFile })
      // clear saved form on successful submit
      try { localStorage.removeItem(STORAGE_KEY) } catch (e) {}
    } catch (err) {
      // zod error or phone validation error
      if (err?.errors) {
        setValidationError(err.errors.map((zErr) => zErr.message).join('. '))
      } else {
        setValidationError(err.message || String(err))
      }
    }
  }

  const isEmailValid = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)
  const canSubmit = name.trim().length > 0 && isEmailValid(email) && password.length >= 6

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-lg bg-white p-8 rounded shadow text-center">
          <h3 className="text-2xl font-semibold mb-2">Application Submitted</h3>
          <p className="text-gray-600">An admin will review your bio shortly. You will receive an email after approval.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h3 className="text-xl font-medium mb-4">Register as Owner / Author</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Username (optional)</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="optional public handle" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="author">Author</option>
              <option value="bookstore">Bookstore</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Store Name (optional)</label>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">WhatsApp Number (optional)</label>
            <WhatsAppInput value={whatsappNumber} onChange={(val) => setWhatsappNumber(val)} defaultCountry="NG" />
          </div>
          <div>
            <label className="block text-sm mb-1">Profile image (optional)</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="bg-slate-900 text-white px-3 py-1 rounded">Choose image</button>
              {profilePreview && <img src={profilePreview} alt="preview" className="h-12 w-12 rounded object-cover" />}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full border px-3 py-2 rounded" rows={4} />
          </div>
          {validationError && <div className="text-sm text-red-600">{validationError}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={!canSubmit || loading} aria-disabled={!canSubmit || loading} className={`w-full bg-slate-900 text-white py-2 rounded ${(!canSubmit || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
