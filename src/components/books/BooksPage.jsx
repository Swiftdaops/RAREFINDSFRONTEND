import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar";
import BookCard from "../BookCard";
import { useTheme } from "../theme/theme-provider";

// Theme-aware logos (light / dark)
const lightLogo = 'https://res.cloudinary.com/dnitzkowt/image/upload/v1763890946/ChatGPT_Image_Nov_16__2025__07_00_44_PM-removebg-preview_nu512d.png'
const darkLogo = 'https://res.cloudinary.com/dnitzkowt/image/upload/v1763890936/ChatGPT_Image_Nov_16__2025__08_45_35_PM-removebg-preview_oahwmn.png'

// Small typing header component: types the given `text` then calls `onDone`.
function TypingHeader({ text = 'Find Rare Books', speed = 60, className = '', onDone = () => {} }) {
  const [display, setDisplay] = React.useState('')
  const [idx, setIdx] = React.useState(0)

  useEffect(() => {
    if (idx >= text.length) {
      onDone()
      return undefined
    }
    const id = setTimeout(() => {
      setDisplay((d) => d + text[idx])
      setIdx((i) => i + 1)
    }, speed)
    return () => clearTimeout(id)
  }, [idx, text, speed, onDone])

  return (
    <h1 className={className} aria-live="polite">
      {display}
      <span className="inline-block w-1 ml-1 align-middle">{idx < text.length ? <span className="animate-pulse">|</span> : null}</span>
    </h1>
  )
}

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [typedDone, setTypedDone] = useState(false)
  
  // Base container classes (padding, layout)
  const base = "mx-auto flex-1 w-full flex-col px-4 sm:px-6 lg:px-8 pb-20 pt-6 sm:pt-8 lg:pt-12 h-full";

  // Theme from provider — compute effective theme and apply classes via JS
  const { themeMode } = useTheme() || { themeMode: null };
  const effective = (() => {
    if (!themeMode) return 'light';
    const t = String(themeMode).toLowerCase();
    if (t === 'system') return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return t;
  })();

  // Theme-class mapping applied by JS (prefer these over inline Tailwind `dark:` utilities)
  const mainThemeClasses = effective === 'dark' ? 'bg-stone-950 text-white' : 'card bg-white text-stone-950';

  const heroSectionClass = "mx-auto my-4 sm:my-6 w-full  text-center md:text-left rounded-3xl overflow-hidden pb-20 px-2 sm:px-4";

  // Panel base classes (layout only). Color/text are applied from `panelThemeClasses`.
  const heroPanelBase = "relative overflow-hidden rounded-3xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 shadow-sm w-full";
  const panelThemeClasses = effective === 'dark' ? 'bg-stone-950 text-white' : 'bg-white card text-stone-950';

  return (
    // Apply combined classes to the main element
    <main className={`${base} ${mainThemeClasses}`}>
      <section className={heroSectionClass}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              // Apply theme-controlled panel classes
              className={`${heroPanelBase} ${panelThemeClasses}`} 
            >
              
              <div className="pointer-events-none hidden sm:block absolute -left-10 -top-16 h-32 w-32 rounded-full blur-2xl" />
              <div className="pointer-events-none hidden sm:block absolute -right-10 -bottom-12 h-40 w-40 rounded-full blur-2xl" />
      
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
                <div className="w-full md:w-3/4 lg:w-2/3 text-center md:text-left mx-auto">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <div>
                      <TypingHeader
                        text="Find Rare Books"
                        speed={45}
                        onDone={() => setTypedDone(true)}
                        // Inherits text colors from heroPanelClass: text-stone-950 dark:text-white
                        className="text-lg md:text-xl lg:text-2xl font-semibold leading-tight tracking-tight"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      {effective === 'dark' ? (
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                          {/* Ring is behind the logo, pointer-events-none so it doesn't block the image */}
                          <motion.span
                            aria-hidden
                            className="absolute inset-0 block rounded-full border-4 border-amber-500 pointer-events-none z-0"
                            initial={{ rotate: 0, scale: 0.96, opacity: 0.75 }}
                            animate={{ rotate: 360, scale: [0.96, 1.03, 0.96], opacity: [0.75, 1, 0.75] }}
                            transition={{
                              rotate: { repeat: Infinity, duration: 8, ease: 'linear' },
                              scale: { repeat: Infinity, duration: 2.4, repeatType: 'reverse', ease: 'easeInOut' },
                              opacity: { repeat: Infinity, duration: 2.4, repeatType: 'reverse', ease: 'easeInOut' }
                            }}
                          />

                          <motion.img
                            key={`hero-logo-${effective}-${typedDone}`}
                            src={darkLogo}
                            alt="JohnBooks logo (dark)"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: typedDone ? 1 : 0, scale: typedDone ? 1 : 0.98 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="w-full h-full object-contain rounded relative z-10"
                          />
                        </div>
                      ) : (
                        <motion.img
                          key={`hero-logo-${effective}-${typedDone}`}
                          src={lightLogo}
                          alt="JohnBooks logo"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: typedDone ? 1 : 0, scale: typedDone ? 1 : 0.98 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain rounded"
                        />
                      )}
                    </div>
                   
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    // Inherits text colors from heroPanelClass: text-stone-950 dark:text-white
                    className="max-w-xl md:max-w-lg text-[12px] sm:text-sm leading-relaxed mx-auto md:mx-0 font-medium"
                  >
                    Here at RAREFINDS we only sell unique, hard-to-find titles approved and used by many universities across Nigeria.
                  </motion.p>

                  
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center gap-2 pt-1"
                  >
                   
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>
        <section className="mb-6 space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            // Inherits text colors from mainClasses
            className="text-xl font-semibold tracking-tight sm:text-2xl text-center pb-10"
          >
            Shop rare books endorsed by
            top professors and authors across Nigeria.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            // Inherits text colors from mainClasses
            className=" mx-auto text-center text-[12px] leading-relaxed"
          >
            All books are endorsed by leading professors and authors and are
            available for you — just a search away. Curated titles for book
            lovers across Nigeria. Search, tap a book, and complete your order on
            WhatsApp — Buy ebooks faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4"
          >
            <SearchBar onResults={setBooks} />
          </motion.div>
        </section>

        
      <section className="flex-1">
        {books.length === 0 ? (
          <p className="mt-6 text-[12px] pb-30">
            Start with a mood: “African history”, “Nigerian poetry”, “philosophy
            of love”… we’ll surface rare gems.
          </p>
        ) : (
          <motion.div
            layout
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {books.map((book, i) => {
              const key = book._id || book.id || book.cover_i || i;
              return <BookCard key={key} book={book} index={i} />;
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
}

export default BooksPage;