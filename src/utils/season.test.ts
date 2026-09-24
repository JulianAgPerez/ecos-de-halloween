import { describe, it, expect } from "vitest";
import { getSeason } from "./season";

describe("getSeason", () => {
  it("returns 'halloween-day' on October 31st", () => {
    const date = new Date(2023, 9, 31); // October is month 9 (0-indexed)
    expect(getSeason(date)).toBe("halloween-day");
  });

  it("returns 'october' on October 30th", () => {
    const date = new Date(2023, 9, 30);
    expect(getSeason(date)).toBe("october");
  });

  it("returns 'off-season' on November 1st", () => {
    const date = new Date(2023, 10, 1);
    expect(getSeason(date)).toBe("off-season");
  });
});
