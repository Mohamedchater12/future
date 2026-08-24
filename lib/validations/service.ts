import { z } from "zod";
import { optionalImageUrl } from "@/lib/validations/common";

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().trim().min(1, "Description is required").max(1000),
  icon: z.string().trim().min(1, "Choose an icon"),
  image: optionalImageUrl(),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const updateServiceSchema = serviceSchema.partial();
