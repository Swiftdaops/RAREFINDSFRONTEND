 
import { useState, useEffect, useCallback } from "react";
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from "./ui/button";
import { useTheme } from './theme/theme-provider'
import React from 'react'
import { Sun, Moon } from 'lucide-react'

function DarkModeSwitch() {
    const { themeMode, setTheme, applyLocalTheme } = useTheme() || { themeMode: null, setTheme: null, applyLocalTheme: null }

    const effective = (() => {
        if (!themeMode) return 'light'
        const t = String(themeMode).toLowerCase()
        if (t === 'system') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return t
    })()

    const toggle = useCallback(() => {
        try {
            const next = effective === 'dark' ? 'light' : 'dark'
            if (typeof setTheme === 'function') {
                // prefer setTheme (may persist); fallback to applyLocalTheme
                setTheme(next)
            } else if (typeof applyLocalTheme === 'function') {
                applyLocalTheme(next)
            } else {
                if (next === 'dark') document.documentElement.classList.add('dark')
                else document.documentElement.classList.remove('dark')
            }
        } catch (e) {
            // ignore
        }
    }, [effective, setTheme, applyLocalTheme])

    return (
        <button onClick={toggle} title="Toggle dark mode" className="inline-flex items-center gap-2 px-2 py-1 rounded border bg-white/5 text-sm">
            {effective === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}

function Navbar() {
    const lightLogo = "https://res.cloudinary.com/dnitzkowt/image/upload/v1763890946/ChatGPT_Image_Nov_16__2025__07_00_44_PM-removebg-preview_nu512d.png";
    const darkLogo = "https://res.cloudinary.com/dnitzkowt/image/upload/v1763890936/ChatGPT_Image_Nov_16__2025__08_45_35_PM-removebg-preview_oahwmn.png";
    const logoLight = lightLogo;
    const logoDark = darkLogo;

    const navBase = "sticky top-0 z-30 border-b backdrop-blur-md";
    // determine effective theme from provider to apply simple dark-mode styles
    const { themeMode } = useTheme() || { themeMode: null }
    const effectiveTheme = (() => {
        if (!themeMode) return 'light'
        const t = String(themeMode).toLowerCase()
        if (t === 'system') return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        return t
    })()

    const navClassName = `${navBase} ${effectiveTheme === 'dark' ? 'bg-stone-950 text-white' : ''}`;

    function ThemeStatus() {
        try {
            const { themeMode } = useTheme() || { themeMode: null }
            const label = themeMode ? String(themeMode).charAt(0).toUpperCase() + String(themeMode).slice(1) : 'Loading'
            return (
                <span
                    title="Current global theme (admin-controlled)"
                    className="px-2 py-1 rounded text-sm border flex items-center gap-2"
                    aria-live="polite"
                >
                    <span className={`w-2 h-2 rounded-full ${themeMode === 'dark' ? 'bg-amber-400' : 'bg-stone-800'}`} />
                    <span className="sr-only">Theme:</span>
                    <span>{label}</span>
                </span>
            )
        } catch (e) {
            return null
        }
    }

return (
    <nav className={navClassName}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                                <Link to="/" className="flex items-center gap-2">
                                    <span className="rounded-full border-white border-2 p-1 flex items-center justify-center">
                                        <motion.div className="relative h-10 w-10 flex items-center justify-center">
                                            <motion.span
                                                aria-hidden
                                                initial={{ rotate: 0, opacity: 0 }}
                                                animate={typedDone => ({ rotate: 360, opacity: 1 })}
                                                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                                                className="absolute inset-0 rounded-full border-2 border-amber-500 pointer-events-none z-0"
                                            />
                                            <motion.img
                                                key={effectiveTheme}
                                                src={effectiveTheme === 'dark' ? logoDark : logoLight}
                                                alt={effectiveTheme === 'dark' ? 'JOHNBOOKS logo (dark)' : 'JOHNBOOKS logo'}
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                className="h-8 w-8 object-contain rounded-full relative z-10"
                                            />
                                        </motion.div>
                                    </span>
                                    <span className="text-base  font-bold tracking-tight">
                                            RAREFINDS
                                    </span>
                                </Link>
            </div>
            <div className="flex items-center gap-3">
                {/** Dark mode switch — toggles local/app theme */}
                    <DarkModeSwitch />
                <Link to="/owner/register" className={`px-3 py-1 rounded text-sm font-medium border-2 ${effectiveTheme === 'dark' ? 'text-white' : ''}`}>
                    Sign up
                </Link>
            </div>
        </div>

        
    </nav>
);
}

export default Navbar;
