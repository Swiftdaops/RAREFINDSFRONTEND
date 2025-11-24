
import React from "react";
import { useNavigate } from 'react-router-dom'

function Footer() {
  const base = "mx-auto border-t w-full text-center text-sm";
  // Theme-aware classes: light => bg-white + text-stone-950; dark => bg-stone-950 + text-white
  const themeClass = "card text-stone-950 dark:bg-stone-950 dark:text-white";
  const navigate = useNavigate()

  // Fixed footer at bottom with safe-area padding for devices with notches.
  // Keep minimal height and add a small backdrop blur for readability over content.
  return (
    <footer
      className={`${base} ${themeClass} fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 py-3 px-4 backdrop-blur-sm border-slate-200 dark:border-stone-800`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="text-sm">© {new Date().getFullYear()} JOHNBOOKS — Rare Books for Nigeria.</div>
      <button
        onClick={() => navigate('/owner/login')}
        className="ml-2 px-2 py-1 rounded border border-slate-300 dark:border-white/20 bg-white/5 text-sm hover:bg-white/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        Admin
      </button>
    </footer>
  );
}

export default Footer;

