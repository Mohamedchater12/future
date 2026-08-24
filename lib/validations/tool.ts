import { z } from "zod";
import { imageUrl } from "@/lib/validations/common";
import { TOOL_CATEGORIES } from "@/lib/admin/toolCategories";

export const toolSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  iconUrl: imageUrl("Upload an icon"),
  category: z.enum(TOOL_CATEGORIES),
  order: z.coerce.number().int().min(0),
  visible: z.boolean(),
});

export type ToolInput = z.infer<typeof toolSchema>;

export const updateToolSchema = toolSchema.partial();
