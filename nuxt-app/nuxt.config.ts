// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,

  css: [
    "~/assets/style/root.scss",
    "~/assets/style/typography.scss",
    "~/assets/style/main.scss",
    "~/assets/style/normalize.css",
  ],

  runtimeConfig: {
    public: {
      apiUrl: "https://run.mocky.io/v3", // usually taken from process.env.API_URL
    },
  },

  vite: {
    plugins: [svgLoader({})],
  },

  modules: ["@nuxt/image", "@pinia/nuxt"],

  plugins: [
    '~/plugins/url',
  ]
});
