<template>
  <div class="recipes-finder">
    <SearchBar />
    <RecipesList :recipes="recipes" :is-favorites-list="true" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFavoritesStore } from "~/stores/favorites";
import { getRecipesList } from "~/services/recipes/list";
import { Recipe } from "~/types/api/recipe";
import RecipesList from "~/components/RecipesList/RecipesList.vue";

const recipes = ref<Recipe[]>([]);

const { favorites } = storeToRefs(useFavoritesStore());

watch(
  favorites,
  () => {
    recipes.value = favorites.value;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.recipes-finder {
  margin: auto;

  @include mixins.breakpointDesktop {
    max-width: var(--container-desktop-width);
  }
}
</style>
