import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().trim().min(1, "Le message ne peut pas être vide").max(4000),
});

export type MessageInput = z.infer<typeof messageSchema>;
