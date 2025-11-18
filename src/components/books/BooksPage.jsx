 
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar";
import BookCard from "../BookCard";

function BooksPage() {
  const [books, setBooks] = useState([]);
  

  
  const base = "mx-auto flex-1 flex w-full flex-col px-4 pb-6";
  const themeClass = "light text-stone-950";

  const heroSectionClass = "light text-stone-950 mx-auto my-6 max-w-5xl text-center sm:text-left rounded-3xl overflow-hidden";

  const heroPanelClass = "relative overflow-hidden rounded-4xl px-4 py-4 shadow-sm sm:px-6 sm:py-5 card";

  return (
    <main className={`${base} ${themeClass}`}>
      <section className={heroSectionClass}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className={heroPanelClass}
            >
              
              <div className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -right-10 -bottom-12 h-40 w-40 rounded-full  blur-2xl" />
      
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl mb-2"
                  >
                    Find Rare Books
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="max-w-md text-[12px] leading-relaxed mx-auto font-extrabold"
                  >
                    Here at JohnBooks we only sell unique, hard-to-find titles approved and used by many universities across Nigeria.
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
            className="text-xl font-semibold tracking-tight sm:text-2xl text-center "
          >
            Shop rare books endorsed by
            top professors and authors across Nigeria.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
          <p className="mt-6 text-[12px]">
            Start with a mood: “African history”, “Nigerian poetry”, “philosophy
            of love”… we’ll surface rare gems.
          </p>
        ) : (
          <motion.div
            layout
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
