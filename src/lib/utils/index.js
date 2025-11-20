// src/lib/utils/index.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility to merge Tailwind class names + conditional classes
 * Used by shadcn/ui components like <Textarea />, <Button />, etc.
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs))
}
