import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFavoritesStore } from "./favorites";
import { getRecipeDetails } from "~/services/recipes/details";

vi.mock("~/services/recipes/details", () => ({
  getRecipeDetails: vi.fn(),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");
  return {
    ...(actual as any),
    onMounted: (fn: () => void) => fn(),
  };
});

describe("useFavoritesStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it("initializes with empty favorites array", () => {
    const store = useFavoritesStore();
    expect(store.favorites).toEqual([]);
  });

  it("loads favorites from localStorage on mount", () => {
    const storedFavorites = [
      {
        id: "123",
        title: "Pasta Carbonara",
        ingredients: [
          { name: "pasta", quantity: 200, unit: "grams" },
          { name: "eggs", quantity: 2, unit: "" },
          { name: "bacon", quantity: 100, unit: "grams" },
        ],
        preparation: ["Cook pasta, fry bacon, mix with eggs."],
        prep_time: {
          unit: "minutes",
          quantity: 20,
        },
        description: "test desc",
        image: "/image.jpg",
        thumb: "/thumb.jpg",
        allergens: ["gluten"],
        servings: 2,
        curiosity: "Nothing to say",
      },
    ];

    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify(storedFavorites)
    );


    const store = useFavoritesStore();

    expect(store.favorites).toEqual(storedFavorites);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("favorites");
  });

  it("handles invalid JSON in localStorage on mount", () => {

    localStorageMock.getItem.mockReturnValueOnce("{invalid json}");


    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});


    const store = useFavoritesStore();

    // check that favorites defaulted to an empty array
    expect(store.favorites).toEqual([]);

    // check that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();


    consoleErrorSpy.mockRestore();
  });

  it("adds a recipe to favorites", async () => {

    const mockRecipe = {
      id: "123",
      title: "Pasta Carbonara",
      ingredients: [
        { name: "pasta", quantity: 200, unit: "grams" },
        { name: "eggs", quantity: 2, unit: "" },
        { name: "bacon", quantity: 100, unit: "grams" },
      ],
      preparation: ["Cook pasta, fry bacon, mix with eggs."],
      prep_time: {
        unit: "minutes",
        quantity: 20,
      },
      description: "test desc",
      image: "/image.jpg",
      thumb: "/thumb.jpg",
      allergens: ["gluten"],
      servings: 2,
      curiosity: "Nothing to say",
    };

    vi.mocked(getRecipeDetails).mockResolvedValue(mockRecipe);


    const store = useFavoritesStore();


    await store.addToFavorites("123");

    // check that the recipe was added to favorites
    expect(store.favorites).toEqual([mockRecipe]);

    // check that the recipe was saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify([mockRecipe])
    );
  });

  it("handles API error when adding to favorites", async () => {

    vi.mocked(getRecipeDetails).mockRejectedValue(new Error("API error"));


    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});


    const store = useFavoritesStore();


    await store.addToFavorites("123");

    // check that favorites remain empty
    expect(store.favorites).toEqual([]);

    // check that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error adding to favorites:",
      expect.any(Error)
    );


    consoleErrorSpy.mockRestore();
  });

  it("handles null recipe when adding to favorites", async () => {

    vi.mocked(getRecipeDetails).mockResolvedValue(null);


    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});


    const store = useFavoritesStore();


    await store.addToFavorites("123");

    // check that favorites remain empty
    expect(store.favorites).toEqual([]);

    // check that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get recipe details"
    );

    consoleErrorSpy.mockRestore();
  });

  it("adds a recipe to existing favorites", async () => {
    const existingRecipe = {
      id: "456",
      title: "Pizza Margherita",
      ingredients: [
        { name: "dough", quantity: 300, unit: "grams" },
        { name: "tomatoes", quantity: 200, unit: "grams" },
        { name: "mozzarella", quantity: 150, unit: "grams" },
      ],
      preparation: ["Make dough, add toppings, bake."],
      prep_time: {
        unit: "minutes",
        quantity: 30,
      },
      description: "Classic Italian pizza",
      image: "/pizza.jpg",
      thumb: "/pizza-thumb.jpg",
      allergens: ["gluten", "dairy"],
      servings: 2,
      curiosity: "Named after Queen Margherita",
    };

    const newRecipe = {
      id: "123",
      title: "Pasta Carbonara",
      ingredients: [
        { name: "pasta", quantity: 200, unit: "grams" },
        { name: "eggs", quantity: 2, unit: "" },
        { name: "bacon", quantity: 100, unit: "grams" },
      ],
      preparation: ["Cook pasta, fry bacon, mix with eggs."],
      prep_time: {
        unit: "minutes",
        quantity: 20,
      },
      description: "test desc",
      image: "/image.jpg",
      thumb: "/thumb.jpg",
      allergens: ["gluten"],
      servings: 2,
      curiosity: "Nothing to say",
    };


    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "favorites") {
        return JSON.stringify([existingRecipe]);
      }
      return null;
    });


    vi.mocked(getRecipeDetails).mockResolvedValue(newRecipe);


    const store = useFavoritesStore();

    expect(store.favorites).toEqual([existingRecipe]);

 
    localStorageMock.setItem.mockClear();

 
    await store.addToFavorites("123");

    // check that both recipes are in favorites
    expect(store.favorites).toEqual([existingRecipe, newRecipe]);

    // check that localStorage was updated with both recipes
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify([existingRecipe, newRecipe])
    );
  });

  it("removes a recipe from favorites", () => {
 
    const mockRecipe = {
      id: "123",
      title: "Pasta Carbonara",
      ingredients: [
        { name: "pasta", quantity: 200, unit: "grams" },
        { name: "eggs", quantity: 2, unit: "" },
        { name: "bacon", quantity: 100, unit: "grams" },
      ],
      preparation: ["Cook pasta, fry bacon, mix with eggs."],
      prep_time: {
        unit: "minutes",
        quantity: 20,
      },
      description: "test desc",
      image: "/image.jpg",
      thumb: "/thumb.jpg",
      allergens: ["gluten"],
      servings: 2,
      curiosity: "Nothing to say",
    };

    const pizzaRecipe = {
      id: "456",
      title: "Pizza Margherita",
      ingredients: [
        { name: "dough", quantity: 300, unit: "grams" },
        { name: "tomatoes", quantity: 200, unit: "grams" },
        { name: "mozzarella", quantity: 150, unit: "grams" },
      ],
      preparation: ["Make dough, add toppings, bake."],
      prep_time: {
        unit: "minutes",
        quantity: 30,
      },
      description: "Classic Italian pizza",
      image: "/pizza.jpg",
      thumb: "/pizza-thumb.jpg",
      allergens: ["gluten", "dairy"],
      servings: 2,
      curiosity: "Named after Queen Margherita",
    };

    const storedFavorites = [mockRecipe, pizzaRecipe];
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify(storedFavorites)
    );


    const store = useFavoritesStore();


    store.removeFromFavorites("123");

    // check that the recipe was removed from favorites
    expect(store.favorites).toEqual([pizzaRecipe]);

    // check that the updated favorites were saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify([pizzaRecipe])
    );
  });

  it("loads a recipe from favorites", () => {
    const mockRecipe = {
      id: "123",
      title: "Pasta Carbonara",
      ingredients: [
        { name: "pasta", quantity: 200, unit: "grams" },
        { name: "eggs", quantity: 2, unit: "" },
        { name: "bacon", quantity: 100, unit: "grams" },
      ],
      preparation: ["Cook pasta, fry bacon, mix with eggs."],
      prep_time: {
        unit: "minutes",
        quantity: 20,
      },
      description: "test desc",
      image: "/image.jpg",
      thumb: "/thumb.jpg",
      allergens: ["gluten"],
      servings: 2,
      curiosity: "Nothing to say",
    };

    const pizzaRecipe = {
      id: "456",
      title: "Pizza Margherita",
      ingredients: [
        { name: "dough", quantity: 300, unit: "grams" },
        { name: "tomatoes", quantity: 200, unit: "grams" },
        { name: "mozzarella", quantity: 150, unit: "grams" },
      ],
      preparation: ["Make dough, add toppings, bake."],
      prep_time: {
        unit: "minutes",
        quantity: 30,
      },
      description: "Classic Italian pizza",
      image: "/pizza.jpg",
      thumb: "/pizza-thumb.jpg",
      allergens: ["gluten", "dairy"],
      servings: 2,
      curiosity: "Named after Queen Margherita",
    };

    const storedFavorites = [mockRecipe, pizzaRecipe];
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify(storedFavorites)
    );


    const store = useFavoritesStore();


    const recipe = store.loadFromFavorites("456");

    // check that the correct recipe was returned
    expect(recipe).toEqual(pizzaRecipe);
  });

  it("handles empty localStorage when loading from favorites", () => {

    localStorageMock.getItem.mockReturnValueOnce(null);


    const store = useFavoritesStore();


    const recipe = store.loadFromFavorites("123");

    // check that undefined was returned
    expect(recipe).toBeUndefined();
  });

  it("handles invalid JSON in localStorage when loading from favorites", () => {

    localStorageMock.getItem.mockReturnValueOnce("{invalid json}");


    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});


    const store = useFavoritesStore();


    const recipe = store.loadFromFavorites("123");


    expect(recipe).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
});
