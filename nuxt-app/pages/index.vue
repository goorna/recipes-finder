<template>
  <div class="recipes-finder">
    <SearchBar />
    <RecipesList v-if="recipes" :recipes="recipes" />
  </div>
</template>

<script setup lang="ts">
import { getRecipesList } from "~/services/recipes/list";
import RecipesList from "~/components/RecipesList/RecipesList.vue";

const { data: recipes } = getRecipesList();

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
