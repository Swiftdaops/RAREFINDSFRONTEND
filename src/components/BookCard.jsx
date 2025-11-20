 
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { getBookTitle, getBookAuthor, getCoverImage } from "../api/freebooksApi";
import placeholderImg from "./books/logo.png";
import { buildWhatsAppOrderUrl } from "../lib/utils/whatsapp";

function BookCard({ book, index }) {
  const title = getBookTitle(book);
  const author = getBookAuthor(book);
  const cover = getCoverImage(book);
  const year = book.year;
  const buyUrl = buildWhatsAppOrderUrl(book);

  const handleBuy = (e) => {
    if (!buyUrl) {
      e.preventDefault();
      // Import toast if not already imported in this file, or pass it down
      // Assuming toast is available or we use alert for now if toast isn't imported
      alert("This book is not available for purchase via WhatsApp yet.");
      return;
    }
    // Allow default <a> behavior
  };

  const formatBookPrice = (b) => {
    if (!b) return '';
    // New shape: price: { amount, currency }
    const priceObj = b.price;
    let amount = null;
    let currency = null;
    if (priceObj && typeof priceObj === 'object' && priceObj.amount !== undefined) {
      amount = Number(priceObj.amount) || 0;
      currency = priceObj.currency || 'NGN';
    } else if (b.price !== undefined && typeof b.price === 'number') {
      amount = Number(b.price) || 0;
      currency = b.currency || 'NGN';
    } else if (b.price && typeof b.price === 'string') {
      const parsed = Number(b.price.replace(/[^0-9.-]+/g, ''));
      amount = Number.isNaN(parsed) ? 0 : parsed;
      currency = b.currency || 'NGN';
    }

    const formatter = new Intl.NumberFormat('en-NG');
    if (amount === null) return '';
    const formatted = formatter.format(amount);
    if (currency === 'NGN' || currency === 'NGN') return `₦${formatted}`;
    return `${currency} ${formatted}`;
  };

  React.useEffect(() => {}, [cover, title, book]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 120, damping: 18 }}
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-sm w-full">
        <CardHeader className="p-0">
          <div
            className="relative overflow-hidden bg-slate-100 w-full"
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

            <div className="absolute left-0 right-0 bottom-0 h-10 bg-black/40" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-2 px-3 pt-3">
          {/* Title moved here to avoid duplicate titles on the card */}
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug">{title}</h3>
          {author && <div className="text-[11px] text-gray-500">{author} {year && <span>• {year}</span>}</div>}

          <p className="text-[12px] text-gray-600 mt-1">{book.shortDescription || book.description || 'No description available.'}</p>
        </CardContent>

        <CardFooter className="px-3 pb-3 pt-1 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-bold">{book.priceLabel ?? formatBookPrice(book)}</div>
            <div className="text-[11px] text-gray-500">Rare pick</div>
          </div>

          <div className="w-1/2">
            <Button
              asChild
              className="h-12 w-full rounded-xl text-[14px] font-medium shadow-sm hover:bg-emerald-700 flex items-center justify-center text-green-950 border-2 border-red-950"
              disabled={!buyUrl}
            >
              <a href={buyUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={handleBuy}>
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
