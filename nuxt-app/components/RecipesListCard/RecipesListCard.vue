<template>
  <div class="recipes-list-card">
    <NuxtImg
      class="recipes-list-card__image"
      :src="recipeImage"
      :alt="recipe.title"
      :placeholder="RECIPE_FALLBACK_IMAGE"
    />
    <div class="recipes-list-card__details">
      <p class="recipe-title">{{ recipe.title }}</p>
      <p class="recipe-description recipes-list-card__details--description">
        {{ recipe.description }}
      </p>
      <div class="recipes-list-card__additional-info">
        <div class="recipes-list-card__additional-info--allergens">
          <Chip
            v-for="allergen in recipeAllergens"
            :key="allergen"
            :label="allergen"
          />
          <span
            v-if="hiddenAllergens"
            class="label-m text-color-primary-dark"
            >{{ `+ ${hiddenAllergens}` }}</span
          >
        </div>
        <div class="recipes-list-card__additional-info--time">
          <Icon name="clock" size="s" color="primary" /><span class="label-m">{{
            recipePrepTime
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from "~/types/api/recipe";
import Icon from "~/components/Icon/Icon.vue";
import Chip from "~/components/Chip/Chip.vue";
import { RECIPE_FALLBACK_IMAGE } from "~/constants/components";
import { abbreviateTimeUnit } from "~/utility/strings";

export interface RecipesListCardProps {
  recipe: Recipe;
}

const props = defineProps<RecipesListCardProps>();

const recipeImage = computed(() => `/images/recipes/${props.recipe.id}.jpg`);

const recipeAllergens = computed(() =>
  props.recipe.allergens.length > 2
    ? props.recipe.allergens.slice(0, 2)
    : props.recipe.allergens
);

const hiddenAllergens = computed(() =>
  props.recipe.allergens.length > 2 ? props.recipe.allergens.length - 2 : 0
);

const recipePrepTime = computed(
  () =>
    `${props.recipe.prep_time.quantity} ${abbreviateTimeUnit(
      props.recipe.prep_time.unit
    )}`
);
</script>

<style lang="scss" scoped>
.recipes-list-card {
  display: grid;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-16);
  overflow: hidden;
  box-shadow: var(--space-1x) var(--space-1x) var(--space-1x) rgba(0, 0, 0, 0.3);

  &__image {
    width: 100%;
    height: var(--card-image-height);
    object-fit: cover;
  }

  &__details {
    display: grid;
    padding: var(--space-8x);
    gap: var(--space-8x);

    &--description {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &__additional-info {
    display: inline-flex;
    justify-content: space-between;

    &--allergens {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2x);
    }

    &--time {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2x);
    }
  }
}
</style>
