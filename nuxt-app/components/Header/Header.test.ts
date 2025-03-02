import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Icon from "~/components/Icon/Icon.vue";
import Header from "~/components/Header/Header.vue";

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

describe("Header.vue", () => {
  it("renders the header component", () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          NuxtImg: {
            template:
              '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
            props: ["src", "alt", "placeholder"],
          },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it.skip("renders the logo image with correct attributes", () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          NuxtImg: {
            template:
              '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
            props: ["src", "alt", "placeholder"],
          },
        },
      },
    });
    const logo = wrapper.find(".header__logo");
    expect(logo.exists()).toBe(true);
    expect(logo.attributes("src")).toBe("/images/logo.png");
    expect(logo.attributes("alt")).toBe("recipe-finder-logo");
  });

  it.skip("renders navigation links correctly", () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          NuxtImg: {
            template:
              '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
            props: ["src", "alt", "placeholder"],
          },
        },
      },
    });
    const links = wrapper.findAll(".header__nav-items a");
    expect(links.length).toBe(2);
    expect(links[0].attributes("href")).toBe("/");
    expect(links[1].attributes("href")).toBe("/favorites");
  });

  it.skip("renders the correct icons in the navigation", () => {
    const wrapper = mount(Header, {
      global: {
        components: {
          Icon,
        },
        stubs: {
          NuxtImg: {
            template:
              '<img :src="src" :alt="alt" :data-placeholder="placeholder" class="nuxt-img" />',
            props: ["src", "alt", "placeholder"],
          },
        },
      },
    });

    const icons = wrapper.findAllComponents(Icon);
    expect(icons.length).toBe(2);
    expect(icons[0].props("name")).toBe("home");
    expect(icons[1].props("name")).toBe("heart");
  });
});
