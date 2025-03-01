<template>
  <div :class="recipesListClasses">
    <RecipesListCard
      v-if="filteredRecipes.length"
      v-for="recipe in filteredRecipes"
      :key="recipe.id"
      :recipe="recipe"
      @click="openModal(recipe.id)"
    />
    <NoResults v-else />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";
import { useModalStore } from "~/stores/modal";
import type { Recipe } from "~/types/api/recipe";
import NoResults from "~/components/NoResults/NoResults.vue";

interface RecipesListProps {
  recipes: Recipe[];
}

const props = withDefaults(defineProps<RecipesListProps>(), {
  recipes: [],
});

const { openModal } = useModalStore();

const { query } = storeToRefs(useSearchStore());

const filteredRecipes = computed(() => {
  const searchQuery = query.value.toLowerCase();

  return props.recipes.filter((recipe) => {
    const titleMatches = recipe.title.toLowerCase().includes(searchQuery);

    const ingredientMatches = recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery)
    );

    return titleMatches || ingredientMatches;
  });
});

const recipesListClasses = computed(() => {
  return {
    "recipes-list": true,
    "recipes-list--no-results": !filteredRecipes.value.length,
  };
});
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.recipes-list {
  display: grid;
  padding: var(--space-16x) var(--space-8x);
  gap: var(--space-8x);

  &--no-results {
    display: flex;
    justify-content: center;
  }

  @include mixins.breakpointTablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include mixins.breakpointDesktop {
    gap: var(--space-12x);
  }
}
</style>
