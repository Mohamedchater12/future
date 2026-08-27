import { z } from "zod";
import { optionalImageUrl, optionalText } from "@/lib/validations/common";

export const projectSchema = z.object({
  title_en: z.string().trim().min(1, "English title is required").max(150),
  title_ar: z.string().trim().max(150).optional(),
  // Backwards compatibility
  title: z.string().trim().max(150).optional(),
  category: z.string().trim().min(1, "Category is required").max(150),
  stat: z.string().trim().min(1, "Result is required").max(60),
  description_en: optionalText(2000),
  description_ar: z.string().trim().max(2000).optional(),
  description: optionalText(2000).optional(),
  image: optionalImageUrl(),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const updateProjectSchema = projectSchema.partial();
