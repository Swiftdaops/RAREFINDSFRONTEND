// src/api/freebooksApi.js (or booksApi.js)

// Open Library Search + Covers
const SEARCH_BASE_URL = "https://openlibrary.org/search.json";
const COVERS_BASE_URL = "https://covers.openlibrary.org/b/id";

/**
 * Search books from Open Library with cover support
 * @param {string} query
 * @param {object} options { limit }
 */
export async function searchBooks(query, { limit = 12 } = {}) {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `${SEARCH_BASE_URL}?q=${encodeURIComponent(
    trimmed
  )}&limit=${limit}&fields=title,author_name,cover_i,first_publish_year,key`;

  console.log("🔍 Searching:", url); // you should see https://openlibrary.org/...

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.error("Network error when calling Open Library:", err);
    throw new Error("Network error while searching books");
  }

  if (!res.ok) {
    throw new Error(`Search failed with status ${res.status}`);
  }

  const data = await res.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  return docs.map((doc, index) => {
    const coverId = doc.cover_i;
    const coverImage = coverId
      ? `${COVERS_BASE_URL}/${coverId}-M.jpg`
      : null;

    return {
      id: doc.key || `book-${index}`,
      title: doc.title,
      author:
        Array.isArray(doc.author_name) && doc.author_name.length > 0
          ? doc.author_name[0]
          : "",
      year: doc.first_publish_year || null,
      coverImage,
      raw: doc,
    };
  });
}

export function getBookTitle(book) {
  return book?.title || book?.raw?.title || "Untitled book";
}

export function getBookAuthor(book) {
  return book?.author || (book?.raw?.author_name?.[0] ?? "");
}

export function getCoverImage(book) {
  if (!book) return null;

  // If backend provides a coverImage object (e.g. { url, public_id }) use its url
  if (book.coverImage && typeof book.coverImage === 'object') {
    return book.coverImage.url || null;
  }

  // If coverImage is already a string URL (OpenLibrary search result), return it
  if (book.coverImage && typeof book.coverImage === 'string') {
    return book.coverImage;
  }

  // Fallbacks
  if (book.coverUrl) return book.coverUrl;
  if (book.raw && book.raw.cover_i) return `${COVERS_BASE_URL}/${book.raw.cover_i}-M.jpg`;

  return null;
}
