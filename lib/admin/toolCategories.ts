import type { ToolsDictionary } from "@/lib/i18n/admin/tools";

export const TOOL_CATEGORIES = ["Design", "Development", "Marketing", "Other"] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export function getToolCategoryLabels(dict: ToolsDictionary): Record<ToolCategory, string> {
  return {
    Design: dict.categories.design,
    Development: dict.categories.development,
    Marketing: dict.categories.marketing,
    Other: dict.categories.other,
  };
}
