import React, { useState, useEffect } from 'react'
import { normalizeToE164, validateWhatsAppNumber, DEFAULT_COUNTRIES } from '../lib/utils/phone'

export default function WhatsAppInput({ value, onChange, defaultCountry = 'NG', showCountry = true, placeholder = 'e.g. 0806xxxxxxx' }) {
  const [country, setCountry] = useState(defaultCountry)
  const [input, setInput] = useState(value || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setInput(value || '')
  }, [value])

  const handleBlur = () => {
    const normalized = normalizeToE164(input, country)
    const check = validateWhatsAppNumber(normalized, country)
    if (!check.valid) {
      setError(check.reason === 'empty' ? 'Please enter a WhatsApp number' : (check.reason === 'invalid_length' ? `Number looks wrong (local should be ${check.details?.expectedLocal || 'valid length'})` : 'Number missing country code or invalid'))
    } else {
      setError('')
    }
    setInput(normalized)
    onChange && onChange(normalized)
  }

  const handleChange = (e) => {
    setInput(e.target.value)
    // live clear error on typing
    if (error) setError('')
  }

  return (
    <div>
      <div className="flex gap-2">
        {showCountry && (
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="border rounded px-2 py-2 text-sm">
            {DEFAULT_COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        )}
        <input value={input} onChange={handleChange} onBlur={handleBlur} className="flex-1 border px-3 py-2 rounded text-sm" placeholder={placeholder} />
      </div>
      {error ? <p className="text-rose-600 text-xs mt-1">{error}</p> : null}
    </div>
  )
}
