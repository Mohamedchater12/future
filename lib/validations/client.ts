import { z } from "zod";

export const clientStatusValues = ["ACTIF", "ARCHIVE"] as const;

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const clientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  company: optionalTrimmed(150),
  email: z.string().trim().min(1, "Email is required").email("Invalid email").max(200),
  phone: optionalTrimmed(30),
  project: optionalTrimmed(200),
  status: z.enum(clientStatusValues),
  notes: optionalTrimmed(3000),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const updateClientSchema = clientSchema.partial();
