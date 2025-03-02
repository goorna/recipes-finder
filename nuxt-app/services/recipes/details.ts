import { useFetch } from "nuxt/app";
import type { Recipe } from "~/types/api/recipe";


/**
 * fetches details for a specific recipe by its ID.
 * 
 * @async
 * @function getRecipeDetails
 * @param {string} recipeId
 * @returns {Promise<Recipe|null>}
 * 
 * @throws {Error} If the API request fails (error will be logged to console)
 * 
 * Note: Currently uses a hardcoded UUID in the API path. 
 */

export const getRecipeDetails = async (recipeId: string) => {
  const {
    public: { apiUrl },
  } = useRuntimeConfig();

  const { data: recipes } = await useFetch(`${apiUrl}/637a1343-e246-4416-a910-5afcce08ff56`, {
    key: "recipe-details",
    method: "GET",
    onResponseError: () => {
      console.error("[ERROR] => getRecipeDetails"); // TODO: add error management system
    },
  });

  return (recipes.value as Recipe[])?.find((recipe: any) => recipe.id === recipeId) || null; 
};
