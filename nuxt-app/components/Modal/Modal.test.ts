import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { ref } from "vue";

vi.mock("#app", () => {
  return {
    useNuxtApp: () => ({
      $img: {
        getImage: () => ({}),
        getSizes: () => ({}),
        cdnURL: "",
      },
    }),
    defineNuxtComponent: (component) => component,
  };
});

vi.mock("#image", () => {
  return {
    useImage: () => ({
      getImage: () => ({}),
      getSizes: () => ({}),
      cdnURL: "",
    }),
    createOperationsGenerator: () => ({}),
    parseSize: () => ({}),
    useAsset: () => ({}),
    prerenderStaticImages: () => ({}),
    __nuxt_component_0: {
      name: "NuxtImg",
      props: ["src", "alt", "placeholder"],
      template:
        '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
    },
    __nuxt_component_1: {
      name: "NuxtPicture",
      props: ["src", "alt", "placeholder"],
      template:
        '<picture><img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-picture" /></picture>',
    },
  };
});

vi.mock("~/components/Icon/Icon.vue", () => ({
  default: {
    name: "Icon",
    props: ["name", "size", "color"],
    template:
      '<div class="icon-mock" :data-name="name" :data-size="size" :data-color="color"></div>',
  },
}));

const mockCloseModal = vi.fn();
vi.mock("~/stores/modal", () => ({
  useModalStore: () => ({
    closeModal: mockCloseModal,
  }),
}));

const mockAddToFavorites = vi.fn();
const mockRemoveFromFavorites = vi.fn();
vi.mock("~/stores/favorites", () => ({
  useFavoritesStore: () => ({
    addToFavorites: mockAddToFavorites,
    removeFromFavorites: mockRemoveFromFavorites,
  }),
}));

const mockRecipeDetails = {
  id: 1,
  title: "Test Recipe",
  image: "/test-image.jpg",
  description: "Test description",
  prepTime: { quantity: 30, unit: "minutes" },
  servings: 4,
  ingredients: [
    { name: "ingredient 1", quantity: 2, unit: "cups" },
    { name: "ingredient 2", quantity: 1, unit: "tbsp" },
  ],
  preparation: ["Step 1", "Step 2"],
  allergens: ["nuts", "dairy"],
  curiosity: "Test curiosity",
};

vi.mock("~/composables/recipe", () => ({
  useRecipe: () => ({
    recipeDetails: ref(mockRecipeDetails),
  }),
}));

vi.mock("~/constants/components", () => ({
  RECIPE_FALLBACK_IMAGE: "/fallback-image.jpg",
}));

import Modal from "./Modal.vue";

describe("Modal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createWrapper(favorites = []) {
    return mount(Modal, {
      props: {
        favorites,
      },
      global: {
        stubs: {
          NuxtImg: {
            template:
              '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
            props: ["src", "alt", "placeholder"],
          },
        },
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              modal: {},
              favorites: {},
            },
          }),
        ],
      },
    });
  }

  it("renders properly with recipe details", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    expect(wrapper.find(".modal").exists()).toBe(true);
    expect(wrapper.find(".modal-container").exists()).toBe(true);
    expect(wrapper.find(".modal-container__header").text()).toContain(
      "Test Recipe"
    );
  });

  it("displays the correct recipe information", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    // check title
    expect(wrapper.find(".modal-container__header span").text()).toBe(
      "Test Recipe"
    );

    // check image
    const img = wrapper.find(".nuxt-img");
    expect(img.attributes("src")).toBe("/test-image.jpg");
    expect(img.attributes("alt")).toBe("Test Recipe");

    // check prep time and servings
    const stats = wrapper.findAll(".modal-container__recipe-stats > div");
    expect(stats[0].text()).toContain("30");
    expect(stats[0].text()).toContain("minutes");
    expect(stats[1].text()).toContain("4");
    expect(stats[1].text()).toContain("servings");

    // check description
    expect(wrapper.find(".modal-container__info > p").text()).toBe(
      "Test description"
    );

    // check ingredients
    const ingredients = wrapper.findAll(".modal-container__list");
    expect(ingredients[0].text()).toContain("ingredient 1 - 2 cups");
    expect(ingredients[1].text()).toContain("ingredient 2 - 1 tbsp");

    // check preparation steps
    const steps = wrapper.findAll("ol > li");
    expect(steps[0].text()).toBe("Step 1");
    expect(steps[1].text()).toBe("Step 2");

    // check allergens
    const allergens = wrapper.findAll("ul:nth-of-type(2) > li");
    expect(allergens[0].text()).toBe("nuts");
    expect(allergens[1].text()).toBe("dairy");

    // check curiosity
    expect(wrapper.find(".recipe-description").text()).toBe("Test curiosity");
  });

  it("shows add favorite icon when recipe is not in favorites", async () => {
    const wrapper = createWrapper([2, 3]);
    await flushPromises();

    const favoriteIcons = wrapper.findAll(".icon-mock[data-name]");
    expect(favoriteIcons[0].attributes("data-name")).toBe("addFavorite");
  });

  it("shows remove favorite icon when recipe is in favorites", async () => {
    const wrapper = createWrapper([1, 2]);
    await flushPromises();

    const favoriteIcons = wrapper.findAll(".icon-mock[data-name]");
    expect(favoriteIcons[0].attributes("data-name")).toBe("removeFavorite");
  });

  it("calls closeModal when close button is clicked", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const closeButton = wrapper.findAll("button")[1];
    await closeButton.trigger("click");

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("calls addToFavorites when add favorite button is clicked", async () => {
    const wrapper = createWrapper([2, 3]);
    await flushPromises();

    const favoriteButton = wrapper.findAll("button")[0];
    await favoriteButton.trigger("click");

    expect(mockAddToFavorites).toHaveBeenCalledWith(1);
  });

  it("calls removeFromFavorites when remove favorite button is clicked", async () => {
    const wrapper = createWrapper([1, 2]);
    await flushPromises();

    const favoriteButton = wrapper.findAll("button")[0];
    await favoriteButton.trigger("click");

    expect(mockRemoveFromFavorites).toHaveBeenCalledWith(1);
  });

  it("formats ingredient labels correctly", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const ingredientLabelFn = wrapper.vm.ingredientLabel;

    // Test with quantity and unit
    const ingredient1 = { name: "test", quantity: 2, unit: "cups" };
    expect(ingredientLabelFn(ingredient1)).toBe("test - 2 cups");

    // Test without quantity and unit
    const ingredient2 = { name: "test", quantity: null, unit: null };
    expect(ingredientLabelFn(ingredient2)).toBe("test ");
  });

  it("has the correct accessibility attributes", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const modalContainer = wrapper.find(".modal-container");
    expect(modalContainer.attributes("role")).toBe("dialog");
    expect(modalContainer.attributes("aria-modal")).toBe("true");
  });
});
