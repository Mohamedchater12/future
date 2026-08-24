import { z } from "zod";
import { optionalText, optionalImageUrl } from "@/lib/validations/common";

export const avisStatusValues = ["PUBLIE", "EN_ATTENTE", "MASQUE"] as const;

export const avisSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  company: optionalText(150),
  photoUrl: optionalImageUrl(),
  rating: z.coerce.number().int().min(1, "Minimum rating: 1").max(5, "Maximum rating: 5"),
  quote: z.string().trim().min(1, "Review text is required").max(2000),
  status: z.enum(avisStatusValues),
  featured: z.boolean(),
});

export type AvisInput = z.infer<typeof avisSchema>;

export const updateAvisSchema = avisSchema.partial();
