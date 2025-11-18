
import React from "react";
import { useNavigate } from 'react-router-dom'

function Footer() {
  const base = "mx-auto border-t w-full py-4 text-center text-sm";
  const themeClass = "card text-stone-950";
  const navigate = useNavigate()

  return (
    <footer className={`${base} ${themeClass} flex items-center justify-center gap-3`}>
      <div>© {new Date().getFullYear()} JOHNBOOKS — Rare Books for Nigeria.</div>
      <button
        onClick={() => navigate('/admin/login')}
        className="ml-2 px-3 py-1 rounded border border-white/40 bg-white/5 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        Admin
      </button>
    </footer>
  );
}

export default Footer;

