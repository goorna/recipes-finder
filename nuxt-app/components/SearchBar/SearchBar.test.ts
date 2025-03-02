import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { ref } from "vue";
import SearchBar from "./SearchBar.vue";

vi.mock("~/stores/search", () => {
  const setQueryMock = vi.fn();
  const queryRef = ref("");

  return {
    useSearchStore: vi.fn(() => ({
      query: queryRef,
      setQuery: setQueryMock,
    })),
  };
});

import { useSearchStore } from "~/stores/search";

describe("SearchBar Component", () => {
  const searchStore = useSearchStore();

  beforeEach(() => {
    vi.clearAllMocks();

    searchStore.query.value = "";
  });

  it("renders properly with default state", () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // check if the component renders
    expect(wrapper.find(".searchbar").exists()).toBe(true);

    // check if the input field is rendered
    const input = wrapper.find(".searchbar__input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("placeholder")).toBe("Type to search...");
    expect(input.attributes("type")).toBe("search");

    // check if the helper text is rendered
    const helperText = wrapper.find(".label-xs");
    expect(helperText.exists()).toBe(true);
    expect(helperText.text()).toBe("Search by ingredient or recipe name");
  });

  it("initializes with the store query value", async () => {
    searchStore.query.value = "pasta";

    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // check if the input field has the initial value from the store
    const input = wrapper.find(".searchbar__input");
    expect(input.element.value).toBe("pasta");
  });

  it("updates the store when input changes", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const input = wrapper.find(".searchbar__input");

    await input.setValue("chicken");

    await input.trigger("input");

    // check if the setQuery function was called with the correct value
    expect(searchStore.setQuery).toHaveBeenCalledWith("chicken");
  });

  it("updates the input when store query changes", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    searchStore.query.value = "pizza";

    await wrapper.vm.$nextTick();
    const input = wrapper.find(".searchbar__input");
    expect(input.element.value).toBe("pizza");
  });

  it("handles empty search query", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const input = wrapper.find(".searchbar__input");

    await input.setValue("chicken");
    await input.trigger("input");

    expect(searchStore.setQuery).toHaveBeenCalledWith("chicken");

    await input.setValue("");
    await input.trigger("input");

    // check if the setQuery function was called with an empty string
    expect(searchStore.setQuery).toHaveBeenCalledWith("");
  });

  it("handles special characters in search query", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const input = wrapper.find(".searchbar__input");

    await input.setValue("pasta & cheese");
    await input.trigger("input");

    // check if the setQuery function was called with the correct value
    expect(searchStore.setQuery).toHaveBeenCalledWith("pasta & cheese");
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    // check if the main container has the correct class
    expect(wrapper.find(".searchbar").exists()).toBe(true);

    // check if the input has the correct class
    expect(wrapper.find(".searchbar__input").exists()).toBe(true);

    // check if the helper text has the correct classes
    const helperText = wrapper.find("span");
    expect(helperText.classes()).toContain("label-xs");
    expect(helperText.classes()).toContain("text-color-primary");
  });

  it("maintains reactivity with the store", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    expect(wrapper.find(".searchbar__input").element.value).toBe("");

    await wrapper.find(".searchbar__input").setValue("salad");
    await wrapper.find(".searchbar__input").trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("salad");

    searchStore.query.value = "burger";
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".searchbar__input").element.value).toBe("burger");
  });

  it("handles multiple input changes", async () => {
    const wrapper = mount(SearchBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const input = wrapper.find(".searchbar__input");

    await input.setValue("p");
    await input.trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("p");

    await input.setValue("pa");
    await input.trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("pa");

    await input.setValue("pas");
    await input.trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("pas");

    await input.setValue("past");
    await input.trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("past");

    await input.setValue("pasta");
    await input.trigger("input");
    expect(searchStore.setQuery).toHaveBeenCalledWith("pasta");

    // check total number of calls
    expect(searchStore.setQuery).toHaveBeenCalledTimes(10);
  });
});
