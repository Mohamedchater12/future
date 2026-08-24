export function buildSwap<T extends { id: string; order: number }>(
  items: T[],
  index: number,
  direction: "up" | "down"
): { id: string; order: number }[] | null {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return null;

  return [
    { id: items[index].id, order: items[targetIndex].order },
    { id: items[targetIndex].id, order: items[index].order },
  ];
}
