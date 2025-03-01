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

export const useRecipe = (): UseRecipeReturn => {
  const { recipeId } = storeToRefs(useModalStore());
  const { loadFromFavorites } = useFavoritesStore();

  const recipeDetails = ref<RecipeDetails | null>(null);

  watchEffect(async () => {
    if (!recipeId.value) return;


    let recipe = loadFromFavorites(recipeId.value);

    if(!recipe) {
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

