 
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { getBookTitle, getBookAuthor } from "../api/freebooksApi";
import { api as http } from "../api/httpClient";

function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setError("");
      if (onResults) onResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        // Fetch ebooks from backend and filter client-side
        const res = await http.get('/api/ebooks');
        const all = Array.isArray(res.data) ? res.data : [];
        const q = query.toLowerCase();
        const filtered = all.filter((b) => {
          const title = (getBookTitle(b) || '').toLowerCase();
          const author = (getBookAuthor(b) || '').toLowerCase();
          return title.includes(q) || author.includes(q);
        }).slice(0, 12);
        setSuggestions(filtered);
        setError("");
        if (onResults) onResults(filtered);
      } catch (e) {
        console.error(e);
        setError("We couldn't reach our library. Try again.");
        setSuggestions([]);
        if (onResults) onResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onResults]);

  return (
    <div className="relative w-full bg-white text-stone-950 font-semibold rounded-2xl 
">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, author, or vibe..."
        className="ml-3 h-11 rounded-xl border-gray-200  text-sm shadow-sm placeholder:text-xs"
      />
      {isSearching && (
        <span className="pointer-events-none absolute right-3 top-2.5 text-[11px] ">
          searching...
        </span>
      )}
      {error && (
        <p className="mt-1 text-[11px] ">
          {error}
        </p>
      )}

      
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white/95 shadow-lg"
          >
            <ul className="divide-y text-xs">
              {suggestions.slice(0, 6).map((book) => (
                <li
                  key={book.id}
                  className="px-3 py-2"
                >
                  <div className="font-medium">{getBookTitle(book)}</div>
                  {getBookAuthor(book) && (
                    <div className="text-[11px] ">
                      {getBookAuthor(book)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
