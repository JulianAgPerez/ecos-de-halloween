interface HasTitle {
  title: string;
}

export function sortByTitle<T extends HasTitle>(items: T[]): T[] {
  return [...items].sort((a, b) => a.title.localeCompare(b.title, "es"));
}