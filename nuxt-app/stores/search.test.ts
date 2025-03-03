import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "./search";
import { createPinia, setActivePinia } from "pinia";


describe("useModalStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty query", () => {
    const store = useSearchStore();
    expect(store.query).toBe("");
  });
});
