
import { getBookTitle, getBookAuthor } from './book'
import { normalizeToE164, formatForWaLink } from './phone'

// Fallback default contact for orders when owner number is missing
const DEFAULT_WHATSAPP_NUMBER = '2348160000000'

export function buildWhatsAppOrderUrl(book) {
  const title = getBookTitle(book)
  const author = getBookAuthor(book)

  // Prefer owner's explicit whatsapp on owner object, then book-level ownerWhatsApp, then owner.phone
  const candidate = (book && (book.owner?.whatsappNumber || book.ownerWhatsApp || book.owner?.phone || book.whatsappNumber)) || ''

  // Normalize to E.164 and then format for wa.me link (no leading +)
  let e164 = ''
  if (candidate) {
    try {
      e164 = normalizeToE164(candidate, 'NG')
    } catch (e) {
      e164 = ''
    }
  }
  const waNumber = formatForWaLink(e164 || DEFAULT_WHATSAPP_NUMBER)

  // Derive readable price text
  let priceText = 'N/A'
  if (book && book.price != null) {
    if (typeof book.price === 'object') {
      const amt = book.price.amount ?? book.price.value ?? book.price.price ?? ''
      const cur = book.price.currency ?? book.price.currencyCode ?? '₦'
      priceText = `${cur}${amt}`
    } else {
      priceText = `₦${book.price}`
    }
  }

  const message = `Hi, I want to order this book.\n\nTitle: ${title}${author ? `\nAuthor: ${author}` : ''}\n\nPrice: ${priceText}`
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${waNumber}?text=${encoded}`
}
