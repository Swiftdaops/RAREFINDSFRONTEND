 
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { buildWhatsAppOrderUrl } from "../lib/utils/whatsapp";
import { getBookTitle, getBookAuthor, getCoverImage } from '../lib/utils/book'

function BookCard({ book, index }) {
  const title = getBookTitle(book);
  const author = getBookAuthor(book);
  const cover = getCoverImage(book);
  const year = book.year;
  const buyUrl = buildWhatsAppOrderUrl(book);

  const formatPrice = (p) => {
    if (p == null || p === '') return 'Price not available'
    if (typeof p === 'object') {
      const amt = p.amount ?? p.value ?? p.price ?? ''
      const cur = p.currency ?? p.currencyCode ?? '₦'
      return `${cur}${amt}`
    }
    return `₦${p}`
  }

  const priceText = formatPrice(book?.price)

  React.useEffect(() => {
    // Helpful debug: log resolved cover URL and identifying info when card renders
    console.debug('BookCard cover:', { id: book?.id ?? book?._id, title, cover });
  }, [cover, title, book]);

  // Fallback placeholder when cover is missing or fails to load
  const placeholderImg = 'https://placehold.co/300x420/94A3B8/FFFFFF?text=COVER'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 120, damping: 18 }}
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm w-full">
        <CardHeader className="p-0">
          <div
            className="relative overflow-hidden bg-stone-100 dark:bg-stone-800 w-full"
            style={{ aspectRatio: '950 / 1338', maxWidth: '100%' }}
          >
            <img
              src={cover || placeholderImg}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholderImg;
              }}
            />

            {/* decorative overlay (no title to avoid duplicate) */}
            <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/40" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-2 px-3 pt-3">
          {/* Title moved here to avoid duplicate titles on the card */}
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug">{title}</h3>
          {author && <div className="text-[11px] text-stone-600 dark:text-stone-300">{author} {year && <span>• {year}</span>}</div>}

          <p className="text-[12px] text-stone-700 dark:text-stone-300 mt-1">{book.shortDescription || book.description || 'No description available.'}</p>
        </CardContent>

        <CardFooter className="px-3 pb-3 pt-1 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-bold text-stone-900 dark:text-white">{priceText}</div>
            <div className="text-[11px] text-stone-600 dark:text-stone-300">Rare pick</div>
          </div>

          <div className="w-1/2">
            <Button
              asChild
              className="h-12 w-full rounded-xl text-[14px] font-medium shadow-sm bg-stone-900 dark:bg-stone-200 text-white dark:text-stone-900 flex items-center justify-center border border-stone-700"
            >
              <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                Buy on WhatsApp
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default BookCard;
