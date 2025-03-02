import { describe, it, expect, vi, beforeAll } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import NoResults from "./NoResults.vue";

beforeAll(() => {
  vi.mock("#app", () => {
    return {
      useNuxtApp: () => ({
        $img: {
          getImage: () => ({}),
          getSizes: () => ({}),
          cdnURL: "",
        },
      }),
    };
  });

  vi.mock("#image", () => {
    return {
      createOperationsGenerator: vi.fn(() => ({})),
      parseSize: vi.fn(() => ({})),
      useImage: vi.fn(() => ({
        getImage: vi.fn(() => ({})),
        getSizes: vi.fn(() => ({})),
        cdnURL: "",
      })),
      prerenderStaticImages: vi.fn(() => ({})),
      defineImageLoader: vi.fn(() => ({})),
      __nuxt_component_0: {
        name: "NuxtImg",
        props: ["src", "alt", "class"],
        template:
          '<img :src="src" :alt="alt" :class="class" class="nuxt-img-mock" />',
      },
      __nuxt_component_1: {
        name: "NuxtPicture",
        props: ["src", "alt", "class"],
        template:
          '<picture><img :src="src" :alt="alt" :class="class" class="nuxt-picture-mock" /></picture>',
      },
    };
  });
});

describe("NoResults Component", () => {
  function createWrapper(props = {}) {
    return mount(NoResults, {
      props,
      global: {
        stubs: {
          NuxtImg: {
            template:
              '<img src="/images/no-results.png" alt="No results" class="nuxt-img-mock" />',
            props: ["src", "alt", "class"],
          },
        },
      },
    });
  }

  it("renders properly", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    expect(wrapper.find(".no-results").exists()).toBe(true);
    expect(wrapper.find(".nuxt-img-mock").exists()).toBe(true);
    expect(wrapper.findAll("p").length).toBe(2);
  });

  it("displays the correct image", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const img = wrapper.find(".nuxt-img-mock");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/images/no-results.png");
    expect(img.attributes("alt")).toBe("No results");
  });

  it("displays the correct static text", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const firstParagraph = wrapper.findAll("p")[0];
    expect(firstParagraph.text()).toBe(
      "Hey, come here! Let me whisper something very important in your ear, very important."
    );
    expect(firstParagraph.classes()).toContain("label-l");
    expect(firstParagraph.classes()).toContain("text-color-primary");
    expect(firstParagraph.classes()).toContain("no-results__label");
  });

  it("displays the default message when isFavoritesList is false", async () => {
    const wrapper = createWrapper({ isFavoritesList: false });
    await flushPromises();

    const secondParagraph = wrapper.findAll("p")[1];
    expect(secondParagraph.text()).toBe("No results here! Get out!");
    expect(secondParagraph.classes()).toContain("label-xl");
    expect(secondParagraph.classes()).toContain("text-color-primary-dark");
    expect(secondParagraph.classes()).toContain("text-italic");
  });

  it("displays the favorites message when isFavoritesList is true", async () => {
    const wrapper = createWrapper({ isFavoritesList: true });
    await flushPromises();

    const secondParagraph = wrapper.findAll("p")[1];
    expect(secondParagraph.text()).toBe("No favorites here! Go add someone!");
    expect(secondParagraph.classes()).toContain("label-xl");
    expect(secondParagraph.classes()).toContain("text-color-primary-dark");
    expect(secondParagraph.classes()).toContain("text-italic");
  });

  it("has the correct structure and classes", async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const container = wrapper.find(".no-results");
    expect(container.exists()).toBe(true);

    // check that the container has the correct classes
    expect(container.classes()).toContain("no-results");

    // check that the image has the correct class
    const img = wrapper.find(".nuxt-img-mock");
    expect(img.exists()).toBe(true);

    // check that the paragraphs have the correct classes
    const paragraphs = wrapper.findAll("p");
    expect(paragraphs[0].classes()).toContain("no-results__label");
    expect(paragraphs[1].classes()).toContain("text-italic");
  });

  it("computes the correct message based on props", () => {
    const defaultWrapper = createWrapper({ isFavoritesList: false });
    const favoritesWrapper = createWrapper({ isFavoritesList: true });

    expect(defaultWrapper.findAll("p")[1].text()).toBe(
      "No results here! Get out!"
    );
    expect(favoritesWrapper.findAll("p")[1].text()).toBe(
      "No favorites here! Go add someone!"
    );
  });
});
