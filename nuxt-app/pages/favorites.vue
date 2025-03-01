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
import RecipesList from "~/components/RecipesList/RecipesList.vue";

const recipes = ref<Recipe[]>([])

const { favorites } = useFavoritesStore();
recipes.value = favorites();

</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.recipes-finder {
  @include mixins.breakpointDesktop {
    max-width: var(--container-desktop-width);
  }
}
</style>
