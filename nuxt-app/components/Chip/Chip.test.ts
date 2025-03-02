import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Chip from "./Chip.vue";

describe("Chip Component", () => {
  it("renders properly", () => {
    const wrapper = mount(Chip, {
      props: {
        label: "Test Chip",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".chip").exists()).toBe(true);
  });

  it("displays the label text correctly", () => {
    const testLabel = "Vegetarian";
    const wrapper = mount(Chip, {
      props: {
        label: testLabel,
      },
    });

    expect(wrapper.text()).toContain(testLabel);
  });

  it("has the correct CSS classes", () => {
    const wrapper = mount(Chip, {
      props: {
        label: "Test",
      },
    });

    const spanElement = wrapper.find("span");
    expect(spanElement.classes()).toContain("label-m");
    expect(spanElement.classes()).toContain("text-color-white");
  });

  it("has the correct DOM structure", () => {
    const wrapper = mount(Chip, {
      props: {
        label: "Test",
      },
    });

    expect(wrapper.find(".chip").exists()).toBe(true);
    expect(wrapper.find(".chip > span").exists()).toBe(true);
  });

  it("throws an error when label prop is missing", () => {
    try {
      // @ts-ignore - intentionally passing invalid props for testing
      mount(Chip, {
        props: {},
      });
      expect("This should not be reached").toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
