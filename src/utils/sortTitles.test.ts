import { describe, expect, it } from "vitest";
import { sortByTitle } from "./sortTitles";

describe("sortByTitle", () => {
  it("should sort items by title in ascending order", () => {
    const items = [
      { title: "Lovecraft" },
      { title: "Albert Camus" },
      { title: "Bohn Doe" },
    ];
    const sortedItems = sortByTitle(items);
    expect(sortedItems).toEqual([
      { title: "Albert Camus" },
      { title: "Bohn Doe" },
      { title: "Lovecraft" },
    ]);
  });
  it("does not mutate the original array", () => {
    const original = [{ title: "Zorro" }, { title: "Álbum" }];
    sortByTitle(original);
    expect(original).toEqual([{ title: "Zorro" }, { title: "Álbum" }]);
  });
});
