// Lightweight phone utilities for WhatsApp formatting and validation
function stripNonDigits(input = '') {
  return String(input).replace(/[^0-9+]/g, '');
}

// Normalize a phone number to E.164-like with leading + and country code.
// For Nigeria (default) it converts inputs like '0806xxxxxxx' or '806xxxxxxx' or '234806xxxxxxx'
// to '+234806xxxxxxx'. It won't attempt advanced number parsing — keep it simple.
export function normalizeToE164(raw, defaultCountry = 'NG') {
  if (!raw) return '';
  let s = String(raw).trim();
  if (!s) return '';

  // remove spaces and non numeric except +
  s = stripNonDigits(s);

  // if starts with + keep it
  if (s.startsWith('+')) {
    return s;
  }

  // if starts with country code without + (e.g., 2348...) add +
  if (defaultCountry === 'NG') {
    if (s.startsWith('234')) return `+${s}`;
    // local leading zero -> replace
    if (s.startsWith('0')) return `+234${s.slice(1)}`;
    // 10-digit local without leading zero
    if (s.length === 10) return `+234${s}`;
    // if it's 11 digits starting with 0 (redundant handled above)
    if (s.length === 11 && s.startsWith('0')) return `+234${s.slice(1)}`;
    // if 13 digits and starts with 234
    if (s.length === 13 && s.startsWith('234')) return `+${s}`;
    // fallback: attach default country
    return `+234${s}`;
  }

  // For other countries we just ensure there's a leading +
  return s.startsWith('+') ? s : `+${s}`;
}

// Validate a WhatsApp number using simple country-specific rules.
export function validateWhatsAppNumber(e164, country = 'NG') {
  if (!e164) return { valid: false, reason: 'empty' };
  const digits = stripNonDigits(e164).replace(/^\+/, '');
  if (country === 'NG') {
    // Expect country code 234 + 10 local digits = 13 digits total (without + it's 13)
    if (!digits.startsWith('234')) return { valid: false, reason: 'missing_country_code' };
    const local = digits.slice(3);
    if (local.length !== 10) return { valid: false, reason: 'invalid_length', details: { expectedLocal: 10, got: local.length } };
    return { valid: true };
  }

  // Generic check: local part between 7 and 12
  if (digits.length < 8 || digits.length > 15) return { valid: false, reason: 'invalid_length' };
  return { valid: true };
}

// Format number for wa.me link (no leading +)
export function formatForWaLink(e164) {
  if (!e164) return '';
  return stripNonDigits(e164).replace(/^\+/, '');
}

export const DEFAULT_COUNTRIES = [
  { code: 'NG', dial: '234', label: 'Nigeria (+234)' },
  { code: 'US', dial: '1', label: 'United States (+1)' },
  { code: 'GB', dial: '44', label: 'United Kingdom (+44)' },
  { code: 'GH', dial: '233', label: 'Ghana (+233)' }
];

export default { normalizeToE164, validateWhatsAppNumber, formatForWaLink, DEFAULT_COUNTRIES };
