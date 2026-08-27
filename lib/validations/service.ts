import { z } from "zod";
import { optionalImageUrl } from "@/lib/validations/common";

export const serviceSchema = z.object({
  title_en: z.string().trim().min(1, "English title is required").max(150),
  title_ar: z.string().trim().max(150).optional(),
  description_en: z.string().trim().min(1, "English description is required").max(1000),
  description_ar: z.string().trim().max(1000).optional(),
  // Backwards compatibility for existing single-language fields
  title: z.string().trim().max(150).optional(),
  description: z.string().trim().max(1000).optional(),
  icon: z.string().trim().min(1, "Choose an icon"),
  image: optionalImageUrl(),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const updateServiceSchema = serviceSchema.partial();
