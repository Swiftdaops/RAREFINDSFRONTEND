import axios from 'axios'
import http from './httpClient'

// Owner-specific API client.
// Prefer an explicit owner backend URL set in `VITE_OWNER_BACKEND_URL`.
// Otherwise derive from the shared `http` client but adjust the port
// to 5001 for local development (owner backend default).
let root = import.meta.env.VITE_OWNER_BACKEND_URL || null;
if (!root) {
    const candidate = (http && http.defaults && http.defaults.baseURL) ? String(http.defaults.baseURL) : (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000');
    try {
        // If candidate has a port (e.g. :5000) replace it with 5001 for owner backend
        const u = new URL(candidate);
        // If explicit owner env not provided, switch default port to 5001 for owner endpoints
        u.port = '5001';
        root = u.toString().replace(/\/$/, '');
    } catch (e) {
        // Fallback: simple replace of :5000 -> :5001, otherwise append :5001
        if (/:(5000|127\.0\.0\.1|localhost)/.test(candidate)) {
            root = candidate.replace(/:5000/, ':5001').replace(/:\/\/$/, '');
        } else {
            root = candidate;
        }
    }
}

const apiClient = axios.create({
        baseURL: `${root.replace(/\/$/, '')}/api/owner`,
        withCredentials: true, // send cookies for auth
})

export default apiClient