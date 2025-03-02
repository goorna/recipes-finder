import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import RecipesListCard from "./RecipesListCard.vue";
import { RECIPE_FALLBACK_IMAGE } from "~/constants/components";
import { abbreviateTimeUnit } from "~/utility/strings";

vi.mock("~/components/Icon/Icon.vue", () => ({
  default: {
    name: "Icon",
    props: ["name", "size", "color"],
    template:
      '<div class="icon-mock" :data-name="name" :data-size="size" :data-color="color"></div>',
  },
}));

vi.mock("~/components/Chip/Chip.vue", () => ({
  default: {
    name: "Chip",
    props: ["label"],
    template: '<div class="chip-mock" :data-label="label">{{ label }}</div>',
  },
}));

vi.mock("~/utility/strings", () => ({
  abbreviateTimeUnit: vi.fn((unit) => (unit === "minutes" ? "min" : unit)),
}));

vi.mock("~/constants/components", () => ({
  RECIPE_FALLBACK_IMAGE: "/images/fallback.jpg",
}));

describe("RecipesListCard Component", () => {
  const mockRecipe = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createWrapper(props = {}) {
    return mount(RecipesListCard, {
      props: {
        recipe: mockRecipe,
        ...props,
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          NuxtImg: {
            template:
              '<img class="nuxt-img-stub" :src="src" :alt="alt" :data-placeholder="placeholder" />',
            props: ["src", "alt", "placeholder"],
          },
        },
      },
    });
  }

  it("renders properly with all recipe information", async () => {
    const wrapper = createWrapper();

    // check if the component renders
    expect(wrapper.find(".recipes-list-card").exists()).toBe(true);

    // check if the image is rendered with correct props
    const image = wrapper.find(".nuxt-img-stub");
    expect(image.exists()).toBe(true);
    expect(image.attributes("src")).toBe("/images/recipes/1.jpg");
    expect(image.attributes("alt")).toBe("Pasta Carbonara");
    expect(image.attributes("data-placeholder")).toBe("/images/fallback.jpg");

    // check if the title is rendered
    const title = wrapper.find(".recipe-title");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Pasta Carbonara");

    // check if the description is rendered
    const description = wrapper.find(".recipe-card-description");
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe("test desc");

    // check if the prep time is rendered
    const prepTime = wrapper.find(
      ".recipes-list-card__additional-info--time span"
    );
    expect(prepTime.exists()).toBe(true);
    expect(prepTime.text()).toBe("20 min");

    // check if the abbreviateTimeUnit function was called
    expect(abbreviateTimeUnit).toHaveBeenCalledWith("minutes");
  });

  it("shows only first two allergens when there are more than two", async () => {
    const wrapper = createWrapper();

    // check if only two allergen chips are rendered
    const allergenChips = wrapper.findAll(".chip-mock");
    expect(allergenChips.length).toBe(1);
    expect(allergenChips[0].text()).toBe("gluten");

    // check if the hidden allergens count is shown
    const hiddenAllergensCount = wrapper.find(
      ".recipes-list-card__additional-info--allergens span"
    );
    expect(hiddenAllergensCount.exists()).toBe(false);
  });

  it("shows all allergens when there are two or fewer", async () => {
    const recipeWithFewAllergens = {
      ...mockRecipe,
      allergens: ["eggs", "dairy"],
    };

    const wrapper = createWrapper({ recipe: recipeWithFewAllergens });

    // check if all allergen chips are rendered
    const allergenChips = wrapper.findAll(".chip-mock");
    expect(allergenChips.length).toBe(2);
    expect(allergenChips[0].text()).toBe("eggs");
    expect(allergenChips[1].text()).toBe("dairy");

    // check that the hidden allergens count is not shown
    const hiddenAllergensCount = wrapper.find(
      ".recipes-list-card__additional-info--allergens span"
    );
    expect(hiddenAllergensCount.exists()).toBe(false);
  });

  it("computes recipeImage correctly", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm.recipeImage).toBe("/images/recipes/1.jpg");

    await wrapper.setProps({
      recipe: {
        ...mockRecipe,
        id: 456,
      },
    });

    expect(wrapper.vm.recipeImage).toBe("/images/recipes/456.jpg");
  });

  it("computes recipeAllergens correctly", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm.recipeAllergens).toEqual(["gluten"]);

    // test with fewer allergens
    await wrapper.setProps({
      recipe: {
        ...mockRecipe,
        allergens: ["eggs"],
      },
    });

    expect(wrapper.vm.recipeAllergens).toEqual(["eggs"]);
  });

  it("computes hiddenAllergens correctly", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm.hiddenAllergens).toBe(0);

    // test with fewer allergens
    await wrapper.setProps({
      recipe: {
        ...mockRecipe,
        allergens: ["eggs", "dairy"],
      },
    });

    expect(wrapper.vm.hiddenAllergens).toBe(0);
  });

  it("computes recipePrepTime correctly", async () => {
    const wrapper = createWrapper();

    expect(wrapper.vm.recipePrepTime).toBe("20 min");

    // test with a different time unit
    await wrapper.setProps({
      recipe: {
        ...mockRecipe,
        prep_time: {
          quantity: 2,
          unit: "hours",
        },
      },
    });

    expect(wrapper.vm.recipePrepTime).toBe("2 hours");
  });

  it("renders without allergens", async () => {
    const recipeWithoutAllergens = {
      ...mockRecipe,
      allergens: [],
    };

    const wrapper = createWrapper({ recipe: recipeWithoutAllergens });

    // check that no allergen chips are rendered
    const allergenChips = wrapper.findAll(".chip-mock");
    expect(allergenChips.length).toBe(0);

    // check that the hidden allergens count is not shown
    const hiddenAllergensCount = wrapper.find(
      ".recipes-list-card__additional-info--allergens span"
    );
    expect(hiddenAllergensCount.exists()).toBe(false);
  });

  it("renders the clock icon for prep time", async () => {
    const wrapper = createWrapper();

    // check if the clock icon is rendered
    const clockIcon = wrapper.find(".icon-mock");
    expect(clockIcon.exists()).toBe(true);
    expect(clockIcon.attributes("data-name")).toBe("clock");
    expect(clockIcon.attributes("data-size")).toBe("s");
    expect(clockIcon.attributes("data-color")).toBe("primary");
  });

  it("applies correct CSS classes", async () => {
    const wrapper = createWrapper();

    // check if the main container has the correct class
    expect(wrapper.find(".recipes-list-card").exists()).toBe(true);

    // check if the image container has the correct class
    expect(wrapper.find(".recipes-list-card__image").exists()).toBe(true);

    // check if the details container has the correct class
    expect(wrapper.find(".recipes-list-card__details").exists()).toBe(true);

    // check if the description has the correct class
    expect(
      wrapper.find(".recipes-list-card__details--description").exists()
    ).toBe(true);

    // check if the additional info container has the correct class
    expect(wrapper.find(".recipes-list-card__additional-info").exists()).toBe(
      true
    );

    // check if the allergens container has the correct class
    expect(
      wrapper.find(".recipes-list-card__additional-info--allergens").exists()
    ).toBe(true);

    // check if the time container has the correct class
    expect(
      wrapper.find(".recipes-list-card__additional-info--time").exists()
    ).toBe(true);
  });
});
