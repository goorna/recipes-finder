<template>
  <div class="recipes-finder">
    <SearchBar />
    <RecipesList :recipes="recipes" />
  </div>
</template>

<script setup lang="ts">
import { getRecipesList } from "~/services/recipes/list";
import { showToast } from "~/utility/toast";
import RecipesList from "~/components/RecipesList/RecipesList.vue";

const { data: recipes } = getRecipesList(); // TODO: get list from store
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.recipes-finder {
  @include mixins.breakpointDesktop {
    max-width: var(--container-desktop-width);
  }
}
</style>
