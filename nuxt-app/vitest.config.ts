import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      enabled: true,
      reportsDirectory: "./coverage",
      reportOnFailure: true,
      include: [
        "**/components/**",
        "**/composables/**",
        "**/stores/**",
        "**/utility/**",
      ],
      exclude: [
        "**/components/Icon/Icons**",
      ]
    },
    reporters: ["default"],
  },
});
