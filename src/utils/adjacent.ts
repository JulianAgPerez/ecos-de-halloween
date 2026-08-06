interface HasTitle {
  title: string;
}

export function findAdjacent<T extends HasTitle>(
  items: T[],
  currentKey: unknown,
  getKey: (item: T) => unknown,
): { previous: T | null; next: T | null } {
  const sorted = [...items].sort((a, b) =>
    a.title.localeCompare(b.title, "es"),
  );
  const index = sorted.findIndex((item) => getKey(item) === currentKey);
  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
