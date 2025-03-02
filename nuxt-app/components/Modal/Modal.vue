<template>
  <div v-if="recipeDetails" class="modal">
    <div class="modal-container modal-text" role="dialog" aria-modal="true">
      <div class="modal-container__header">
        <span>{{ recipeDetails.title }}</span>
        <div>
          <button @click="handleFavoriteClick">
            <div>
              <Icon
                v-if="isFavorite"
                name="removeFavorite"
                size="l"
                color="primary"
              />
              <Icon v-else name="addFavorite" size="l" color="primary" />
            </div>
          </button>
          <button @click="closeModal()">
            <div>
              <Icon name="close" size="l" color="primary" />
            </div>
          </button>
        </div>
      </div>
      <div class="modal-container__content">
        <NuxtImg
          class="modal-container__image"
          :src="recipeDetails.image"
          :alt="recipeDetails.title"
          :placeholder="RECIPE_FALLBACK_IMAGE"
        />
        <div class="modal-container__info">
          <div class="modal-container__recipe-stats">
            <div>
              <span class="label-xxl text-color-primary text-italic">{{
                recipeDetails.prepTime.quantity
              }}</span>
              <span>{{ recipeDetails.prepTime.unit }}</span>
            </div>
            <div>
              <span class="label-xxl text-color-primary text-italic">{{
                recipeDetails.servings
              }}</span>
              <span>servings</span>
            </div>
          </div>
          <p>
            {{ recipeDetails.description }}
          </p>
          <h5 class="label-l text-color-primary text-italic">
            <Icon name="ingredients" size="m" color="primary" />
            Ingredients
          </h5>
          <ul>
            <li
              v-for="ingredient in recipeDetails.ingredients"
              class="modal-container__list"
            >
              {{ ingredientLabel(ingredient) }}
            </li>
          </ul>
          <h5 class="label-l text-color-primary text-italic">
            <Icon name="procedure" size="m" color="primary" />
            Procedure
          </h5>
          <ol>
            <li v-for="step in recipeDetails.preparation">
              {{ step }}
            </li>
          </ol>
          <h5 class="label-l text-color-primary text-italic">
            <Icon name="allergens" size="m" color="primary" />
            Allergens
          </h5>
          <ul>
            <li
              v-for="allergen in recipeDetails.allergens"
              class="modal-container__list"
            >
              {{ allergen }}
            </li>
          </ul>
          <h5 class="label-l text-color-primary text-italic">
            <Icon name="curiosity" size="m" color="primary" />
            Curiosity
          </h5>
          <p class="recipe-description">
            {{ recipeDetails.curiosity }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalStore } from "~/stores/modal";
import { useFavoritesStore } from "~/stores/favorites";
import { useRecipe } from "~/composables/recipe";
import { RECIPE_FALLBACK_IMAGE } from "~/constants/components";
import type { Recipe, Ingredient } from "~/types/api/recipe";
import Icon from "~/components/Icon/Icon.vue";

interface ModalProps {
  favorites: number[];
}

const props = withDefaults(defineProps<ModalProps>(), {
  favorites: [],
});

const { closeModal } = useModalStore();
const { addToFavorites, removeFromFavorites } = useFavoritesStore();

const { recipeDetails } = useRecipe();

const isFavorite = ref(false);

const ingredientLabel = computed(() => (ingredient: Ingredient) => {
  return `${ingredient.name} ${
    ingredient.quantity ? `- ${ingredient.quantity} ${ingredient.unit}` : ""
  }`;
});

const handleFavoriteClick = () => {
  if (isFavorite.value) {
    removeFromFavorites(recipeDetails.value.id);
  } else {
    addToFavorites(recipeDetails.value?.id);
  }
};

const setIsFavorite = () => {
  isFavorite.value = props.favorites.some(
    (id) => id === recipeDetails.value?.id
  );
};

onMounted(setIsFavorite);

watch(() => props.favorites, setIsFavorite);
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.modal {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;

  @include mixins.breakpointDesktop {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--color-white);

    @include mixins.breakpointDesktop {
      width: var(--modal-width-mobile);
      height: var(--modal-height-mobile);
      overflow: hidden;
      position: unset;
      border-radius: var(--border-radius-16);
      border: 1px solid var(--color-border);
    }

    &__header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-8x);
      padding: var(--space-8x);
      border: 1px solid var(--color-border);
      max-height: var(--modal-header-height-mobile);

      & div {
        display: inline-flex;
        align-items: center;
        gap: var(--space-8x);
      }

      & button {
        display: contents;
        background: transparent;
        border: none;
        cursor: pointer;
      }

      & span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - var(--modal-header-height-mobile));
      overflow: scroll;

      @include mixins.breakpointDesktop {
        max-height: calc(100% - var(--modal-header-height-mobile));
      }
    }

    &__image {
      width: 100%;
      height: var(--details-image-height-mobile);
      object-fit: cover;
    }

    &__recipe-stats {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-8x);
      margin: 0 var(--space-16x);

      & div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4x);
      }
    }

    &__info {
      display: grid;
      padding: var(--space-8x) var(--space-8x) var(--space-16x) var(--space-8x);
      gap: var(--space-8x);
      background: linear-gradient(
        180deg,
        rgba(59, 139, 19, 0.2) 1%,
        rgba(255, 255, 255, 1) 10%
      );

      & h5 {
        display: inline-flex;
        gap: var(--space-4x);
        align-items: center;
      }

      @include mixins.breakpointDesktop {
        padding: var(--space-16x);
      }
    }

    &__list {
      text-transform: capitalize;
    }
  }
}
</style>
