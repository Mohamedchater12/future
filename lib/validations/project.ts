import { z } from "zod";
import { optionalImageUrl, optionalText } from "@/lib/validations/common";

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  category: z.string().trim().min(1, "Category is required").max(150),
  stat: z.string().trim().min(1, "Result is required").max(60),
  description: optionalText(2000),
  image: optionalImageUrl(),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const updateProjectSchema = projectSchema.partial();
