import { LastRead } from "./lastRead";

export const lastReadRoute = (last: LastRead): string | null => {
  if (last.type === "classic" && last.slug) return `/classic/${last.slug}`;
  if (last.type === "story" && last.id !== undefined) return `/story/${last.id}`;
  return null;
};