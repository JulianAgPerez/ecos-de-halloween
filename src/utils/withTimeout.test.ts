import { describe, expect, it, vi } from "vitest";
import { withTimeout } from "./withTimeout";

describe("withTimeout", () => {
  it("resolves before timeout", async () => {
    const promise = new Promise((resolve) =>
      setTimeout(() => resolve("success"), 50),
    );

    await expect(withTimeout(promise, 100)).resolves.toBe("success");
  });
  it("rejects the promise if it takes longer than the timeout", async () => {
    await expect(withTimeout(new Promise(() => {}), 50)).rejects.toThrow(
      "timeout",
    );
  });
  it("clears the timer when the promise wins the race", async () => {
    vi.useFakeTimers();
    try {
      await expect(withTimeout(Promise.resolve("ok"), 5000)).resolves.toBe(
        "ok",
      );
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
