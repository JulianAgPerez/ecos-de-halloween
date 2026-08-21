export type Season = "halloween-day" | "october" | "off-season";

/**
 * Returns Oct 31 00:00 of the current year, or next year's once
 * November 1st has started (Halloween is over).
 */
export const getHalloweenTarget = (now = new Date()): Date => {
  const startOfNovember = new Date(now.getFullYear(), 10, 1);
  const year =
    now >= startOfNovember ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 9, 31, 0, 0, 0);
};

export const getDaysUntilHalloween = (now = new Date()): number => {
  const diff = Math.max(0, getHalloweenTarget(now).getTime() - now.getTime());
  return Math.floor(diff / 86400000);
};

export const getSeason = (now = new Date()): Season => {
  const month = now.getMonth();
  const day = now.getDate();
  if (month === 9 && day === 31) return "halloween-day";
  if (month === 9) return "october";
  return "off-season";
};
