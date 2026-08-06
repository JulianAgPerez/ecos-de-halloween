export interface LastRead {
  type: "story" | "classic";
  id?: number;
  slug?: string;
  title: string;
}

const LAST_READ_KEY = "last-read";

export const getLastRead = (): LastRead | null => {
  try {
    const raw = localStorage.getItem(LAST_READ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastRead;
    return parsed && typeof parsed.title === "string" ? parsed : null;
  } catch {
    return null;
  }
};

export const saveLastRead = (last: LastRead): void => {
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(last));
  } catch {
    // storage not available
  }
};
