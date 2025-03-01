import { defineStore } from "pinia";
import { getRecipeDetails } from "~/services/recipes/details";
import type { Recipe } from "~/types/api/recipe";

export const useFavoritesStore = defineStore("favorites", () => {

  const favorites = ref<Recipe[]>([]);

  const addToFavorites = async (recipeId: string) => {
    try {
      const recipe = await getRecipeDetails(recipeId);
      if (!recipe) {
        console.error("Failed to get recipe details");
        return;
      }

      let tempFavorites = [];
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        try {
          tempFavorites = JSON.parse(storedFavorites);
          if (!Array.isArray(tempFavorites)) {
            console.warn("Stored favorites is not an array, resetting");
            tempFavorites = [];
          }
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
          tempFavorites = [];
        }
      }

      tempFavorites.push(recipe);

      localStorage.setItem("favorites", JSON.stringify(tempFavorites));
      favorites.value = tempFavorites;
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = (recipeId: string) => {
    try {
      let tempFavorites = [];
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        try {
          tempFavorites = JSON.parse(storedFavorites);

          if (!Array.isArray(tempFavorites)) {
            console.warn("Stored favorites is not an array, resetting");
            tempFavorites = [];
            return;
          }
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
          return;
        }
      }

      const newFavorites = tempFavorites.filter(
        (favorite) => favorite.id !== recipeId
      );

      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      favorites.value = newFavorites;
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const loadFromFavorites = (recipeId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const recipe = favorites.find((favorite: any) => favorite.id === recipeId);
    return recipe;
  };

  onMounted(() => {
    const storedFavorites = localStorage.getItem("favorites");
    favorites.value = storedFavorites ? JSON.parse(storedFavorites) : [];
  })

  return { favorites, loadFromFavorites, addToFavorites, removeFromFavorites };
});
