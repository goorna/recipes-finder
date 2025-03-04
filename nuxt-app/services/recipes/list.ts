import { useFetch } from "nuxt/app";

/**
 * Fetches the list of recipes from the API
 * 
 * @returns {ReturnType<typeof useFetch>} A composable with the recipes data, loading state, and error information
 * 
 * @description
 * This function retrieves recipe data from an endpoint.
 * It uses the API URL from the runtime configuration
 * 
 * @example
 * const { data: recipes, pending, error } = await getRecipesList();
 * if (recipes.value) {
 *   console.log(`Found ${recipes.value.length} recipes`);
 * }
 */
export const getRecipesList = () => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  return useFetch(`${apiUrl}/1163eb8e-983f-47b7-94d6-5bf6b605f574`, {
    key: "recipes-list",
    method: "GET",
    onResponseError: () => {
      console.error("[ERROR] => getRecipesList"); // TODO: add error management system
    },
  });
};
