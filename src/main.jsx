import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './components/theme/theme-provider'
import { Toaster } from 'sonner'
import { PostHogProvider } from 'posthog-js/react'
import OwnerAuthProvider from './components/OwnerAuthProvider'

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={posthogOptions}>
      <ThemeProvider>
        <OwnerAuthProvider>
          <App />
        </OwnerAuthProvider>
        <Toaster position="top-right" />
      </ThemeProvider>
    </PostHogProvider>
  </StrictMode>,
)
