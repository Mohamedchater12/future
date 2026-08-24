import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).email().max(200),
  phone: z.string().trim().min(1).max(30),
  company: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((value) => (value ? value : undefined)),
  service: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const demandeStatusValues = ["NOUVEAU", "EN_COURS", "TRAITE", "ARCHIVE"] as const;

export const updateDemandeSchema = z.object({
  status: z.enum(demandeStatusValues).optional(),
  internalNote: z.string().max(3000).optional(),
});
