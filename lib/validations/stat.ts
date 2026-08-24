import { z } from "zod";
import { optionalText } from "@/lib/validations/common";

export const statSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(150),
  value: z.coerce.number().int(),
  suffix: optionalText(10),
  icon: optionalText(50),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type StatInput = z.infer<typeof statSchema>;

export const updateStatSchema = statSchema.partial();
