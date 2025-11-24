import axios from "axios"

// For local development default to the local backend over HTTP.
// In production set `VITE_API_BASE_URL` to your deployed API (https).
// Resolve base URL: prefer env var, otherwise local backend. During DEV
// prefer 127.0.0.1:5000 which avoids potential IPv6/localhost resolution
// differences that can sometimes cause CORS/network issues in browsers.
const rawBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5000' : 'https://rarefinds.onrender.com')

// Normalize baseURL: make localhost/127.0.0.1 hostnames lowercase and
// force `http:` when the developer accidentally set `https://localhost`.
let baseURL = rawBase
try {
  // `new URL()` requires an absolute URL; our fallback is absolute so this
  // should be safe. Guard with try/catch to avoid breaking non-absolute
  // values in unusual setups.
  const u = new URL(baseURL)
  const host = u.hostname.toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1') {
    u.hostname = host
    if (u.protocol === 'https:') u.protocol = 'http:'
    // Keep the URL string without a trailing slash for consistency
    baseURL = u.toString().replace(/\/$/, '')
  }
} catch (e) {
  // If parsing fails, fall back to a tolerant lowercase check as a best-effort
  const lower = String(baseURL).toLowerCase()
  if (lower.startsWith('https://localhost') || lower.startsWith('https://127.0.0.1')) {
    baseURL = baseURL.replace(/^https:/i, 'http:')
  }
}

if (import.meta.env.DEV) {
  // Helpful during development to know which baseURL is used
  // eslint-disable-next-line no-console
  console.info('[http] api baseURL=', baseURL)
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

// Default export for code that imports the http client as a default
export default api
