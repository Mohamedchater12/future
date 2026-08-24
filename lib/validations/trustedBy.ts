import { z } from "zod";
import { imageUrl, optionalUrl } from "@/lib/validations/common";

export const trustedBySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  logoUrl: imageUrl("Upload a logo"),
  link: optionalUrl(),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type TrustedByInput = z.infer<typeof trustedBySchema>;

export const updateTrustedBySchema = trustedBySchema.partial();
