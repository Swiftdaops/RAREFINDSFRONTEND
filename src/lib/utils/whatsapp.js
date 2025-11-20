import { getBookTitle, getBookAuthor } from "../../api/freebooksApi";
import { toast } from "sonner";

export function buildWhatsAppOrderUrl(book) {
  const title = getBookTitle(book);
  const author = getBookAuthor(book);
  
  // Use owner's whatsapp if available, otherwise fallback or empty
  // The backend now returns ownerWhatsapp at the root of the book object
  let whatsapp = book.ownerWhatsapp || (book.owner && book.owner.whatsappNumber);

  if (!whatsapp) {
    // If no owner whatsapp, return null or a special indicator
    // The UI should probably disable the button or show a toast
    return null;
  }

  // Clean number: remove + and spaces
  whatsapp = whatsapp.replace(/[^0-9]/g, '');

  const message = `Hello, I'm interested in your book: ${title}${
    author ? ` by ${author}` : ""
  }`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsapp}?text=${encoded}`;
}
