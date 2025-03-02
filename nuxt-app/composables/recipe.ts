import type { Recipe } from "~/types/api/recipe";
import { useModalStore } from "~/stores/modal";
import { useFavoritesStore } from "~/stores/favorites";
import { getRecipeDetails } from "~/services/recipes/details";

export interface RecipeDetails {
  id: string;
  image: string;
  allergens: string[];
  prepTime: Recipe["prep_time"];
  title: string;
  description: string;
  ingredients: Recipe["ingredients"];
  preparation: Recipe["preparation"];
  curiosity: Recipe["curiosity"];
  servings: Recipe["servings"];
}

interface UseRecipeReturn {
  recipeDetails: Ref<RecipeDetails | null>;
}

/**
 * this composable handles the loading of recipe details either from favorites
 * or from an external source. It automatically reacts to changes in the recipeId
 * from the modal store and updates the recipe details accordingly.
 *
 * @function useRecipe
 * @returns {UseRecipeReturn} An object containing the recipe details ref
 *
 * @example
 * const { recipeDetails } = useRecipe();
 * // recipeDetails will automatically update when recipeId changes
 *
 */

export const useRecipe = (): UseRecipeReturn => {
  const { recipeId } = storeToRefs(useModalStore());
  const { loadFromFavorites } = useFavoritesStore();

  const recipeDetails = ref<RecipeDetails | null>(null);

  watchEffect(async () => {
    if (!recipeId.value) return;

    let recipe = loadFromFavorites(recipeId.value);

    if (!recipe) {
      recipe = await getRecipeDetails(recipeId.value);
    }

    if (recipe) {
      recipeDetails.value = {
        id: recipe.id,
        image: `/images/recipes/${recipe.id}.jpg`,
        allergens: recipe.allergens,
        prepTime: recipe.prep_time,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        preparation: recipe.preparation,
        curiosity: recipe.curiosity,
        servings: recipe.servings,
      };
    }
  });

  return {
    recipeDetails,
  };
};
