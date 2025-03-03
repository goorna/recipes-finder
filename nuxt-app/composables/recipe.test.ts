import { useRecipe } from "~/composables/recipe";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

describe("useRecipe composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes corretly", () => {
    const recipeComposable = useRecipe();

    expect(recipeComposable.recipeDetails.value).toBe(null);
  });
});
