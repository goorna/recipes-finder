import { defineStore } from "pinia";
import { getRecipeDetails } from "~/services/recipes/details";

export const useFavoritesStore = defineStore("favorites", () => {

  const favorites = () => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  const addToFavorites = async (recipeId: string) => {
    try {
      const recipe = await getRecipeDetails(recipeId);
      if (!recipe) {
        console.error("Failed to get recipe details");
        return;
      }

      let favorites = [];
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        try {
          favorites = JSON.parse(storedFavorites);
          if (!Array.isArray(favorites)) {
            console.warn("Stored favorites is not an array, resetting");
            favorites = [];
          }
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
          favorites = [];
        }
      }

      favorites.push(recipe);

      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = (recipeId: string) => {
    try {
      let favorites = [];
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        try {
          favorites = JSON.parse(storedFavorites);

          if (!Array.isArray(favorites)) {
            console.warn("Stored favorites is not an array, resetting");
            favorites = [];
            return;
          }
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
          return;
        }
      }

      const newFavorites = favorites.filter(
        (favorite) => favorite.id !== recipeId
      );

      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const loadFromFavorites = (recipeId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const recipe = favorites.find((favorite: any) => favorite.id === recipeId);
    return recipe;
  };

  const isFavorite = (recipeId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some((favorite: any) => favorite.id === recipeId);
  }

  return { favorites, isFavorite, loadFromFavorites, addToFavorites, removeFromFavorites };
});
