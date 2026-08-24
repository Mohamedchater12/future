import { z } from "zod";

export const clientAvisSchema = z.object({
  rating: z.coerce.number().int().min(1, "Note minimale : 1").max(5, "Note maximale : 5"),
  quote: z.string().trim().min(5, "Votre commentaire est un peu court").max(2000),
});

export type ClientAvisInput = z.infer<typeof clientAvisSchema>;
