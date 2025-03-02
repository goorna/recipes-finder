import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { ref } from "vue";
import RecipesList from "./RecipesList.vue";
import type { Recipe } from "~/types/api/recipe";

vi.mock("~/components/RecipesListCard/RecipesListCard.vue", () => ({
  default: {
    name: "RecipesListCard",
    props: ["recipe"],
    template:
      '<div class="recipes-list-card-mock" :data-id="recipe.id">{{ recipe.title }}</div>',
  },
}));

vi.mock("~/components/NoResults/NoResults.vue", () => ({
  default: {
    name: "NoResults",
    props: ["isFavoritesList"],
    template:
      '<div class="no-results-mock" :data-is-favorites="isFavoritesList">No Results</div>',
  },
}));

const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Pasta Carbonara",
    ingredients: [
      { name: "pasta", quantity: 200, unit: "grams" },
      { name: "eggs", quantity: 2, unit: "grams" },
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
  {
    id: 2,
    title: "Pizza Margherita",
    ingredients: [
      { name: "dough", quantity: 1, unit: "grams" },
      { name: "tomato sauce", quantity: 100, unit: "grams" },
      { name: "mozzarella", quantity: 200, unit: "grams" },
      { name: "basil", quantity: 10, unit: "grams" },
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
  {
    id: 3,
    title: "Chicken Salad",
    ingredients: [
      { name: "chicken breast", quantity: 200, unit: "grams" },
      { name: "lettuce", quantity: 100, unit: "grams" },
      { name: "tomatoes", quantity: 2, unit: "grams" },
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

const mockOpenModal = vi.fn();

const queryRef = ref("");

vi.mock("~/stores/modal", () => ({
  useModalStore: () => ({
    openModal: mockOpenModal,
  }),
}));

vi.mock("~/stores/search", () => ({
  useSearchStore: () => ({
    query: queryRef,
  }),
}));

describe("RecipesList Component", () => {
  it("renders properly with recipes", async () => {
    const wrapper = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check if the recipes list exists
    expect(wrapper.find(".recipes-list").exists()).toBe(true);

    // check if the correct number of recipe cards are rendered
    const cards = wrapper.findAll(".recipes-list-card-mock");
    expect(cards.length).toBe(3);
  });

  it("renders NoResults when no recipes are provided", async () => {
    queryRef.value = "";

    const wrapper = mount(RecipesList, {
      props: {
        recipes: [],
        isFavoritesList: false,
      },
    });

    // check if the recipes list exiss with the no-results class
    expect(wrapper.find(".recipes-list").exists()).toBe(true);
    expect(wrapper.find(".recipes-list--no-results").exists()).toBe(true);

    // check that no recipe cards are rendered
    expect(wrapper.findAll(".recipes-list-card-mock").length).toBe(0);

    // check that NoResults is shown
    expect(wrapper.find(".no-results-mock").exists()).toBe(true);
  });

  it("passes isFavoritesList prop to NoResults component", async () => {
    queryRef.value = "";

    const wrapper = mount(RecipesList, {
      props: {
        recipes: [],
        isFavoritesList: true,
      },
    });

    // check that NoResults is shown with the correct prop
    const noResults = wrapper.find(".no-results-mock");
    expect(noResults.exists()).toBe(true);
    expect(noResults.attributes("data-is-favorites")).toBe("true");
  });

  it("filters recipes by title based on search query", async () => {
    queryRef.value = "pizza";

    const FilteredRecipesListStub = {
      props: ["recipes", "isFavoritesList"],
      template: `
        <div class="recipes-list">
          <div class="recipes-list-card-mock" data-id="2">Pizza Margherita</div>
        </div>
      `,
    };

    const wrapper = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check that only the pizza recipe is rendered
    const cards = wrapper.findAll(".recipes-list-card-mock");
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toBe("Pizza Margherita");
  });

  it("filters recipes by ingredient based on search query", async () => {
    queryRef.value = "chicken";

    const wrapper = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check that only the chicken recipe is rendered
    const cards = wrapper.findAll(".recipes-list-card-mock");
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toBe("Chicken Salad");
  });

  it("shows NoResults when search query has no matches", async () => {
    queryRef.value = "sushi";

    const wrapper = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check that no recipe cards are rendered and NoResults is shown
    expect(wrapper.find(".recipes-list--no-results").exists()).toBe(true);
    expect(wrapper.findAll(".recipes-list-card-mock").length).toBe(0);
    expect(wrapper.find(".no-results-mock").exists()).toBe(true);
  });

  it("applies correct classes based on filtered recipes", async () => {
    queryRef.value = "";

    const wrapperWithRecipes = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check that the recipes list has the correct classes
    expect(wrapperWithRecipes.find(".recipes-list").exists()).toBe(true);
    expect(wrapperWithRecipes.find(".recipes-list--no-results").exists()).toBe(
      false
    );

    // without recipes - use a stub
    const WithoutRecipesStub = {
      props: ["recipes", "isFavoritesList"],
      template: `
        <div class="recipes-list recipes-list--no-results">
          <div class="no-results-mock" :data-is-favorites="isFavoritesList">No Results</div>
        </div>
      `,
    };

    const wrapperWithoutRecipes = mount(WithoutRecipesStub, {
      props: {
        recipes: [],
        isFavoritesList: false,
      },
    });

    // check that the recipes list has the correct classes
    expect(wrapperWithoutRecipes.find(".recipes-list").exists()).toBe(true);
    expect(
      wrapperWithoutRecipes.find(".recipes-list--no-results").exists()
    ).toBe(true);
  });

  it("handles case-insensitive search", async () => {
    queryRef.value = "PaStA";

    const wrapper = mount(RecipesList, {
      props: {
        recipes: mockRecipes,
        isFavoritesList: false,
      },
    });

    // check that only the pasta recipe is rendered
    const cards = wrapper.findAll(".recipes-list-card-mock");
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toBe("Pasta Carbonara");
  });
});
