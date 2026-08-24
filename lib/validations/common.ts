import { z } from "zod";

export function optionalUrl(message = "Invalid URL") {
  return z
    .string()
    .trim()
    .url(message)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));
}

export function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));
}

// Accepts either a full URL (Cloudinary in prod) or a root-relative path
// (/uploads/... — the local dev fallback used when Cloudinary isn't
// configured). A plain z.string().url() rejects the latter.
function isImagePath(value: string) {
  return /^https?:\/\//.test(value) || value.startsWith("/");
}

export function imageUrl(message = "Invalid image") {
  return z
    .string({ required_error: message })
    .trim()
    .min(1, message)
    .refine(isImagePath, { message });
}

export function optionalImageUrl(message = "Invalid image") {
  return z
    .string()
    .trim()
    .refine(isImagePath, { message })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));
}
