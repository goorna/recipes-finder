<template>
  <div class="no-results">
    <NuxtImg
      class="no-results__image"
      src="/images/no-results.png"
      alt="No results"
    />
    <p class="label-l text-color-primary no-results__label">
      Hey, come here! Let me whisper something very important in your ear, very
      important.
    </p>
    <p class="label-xl text-color-primary-dark text-italic">
      {{ customMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface NoResultsProps {
  isFavoritesList?: boolean;
}

const props = withDefaults(defineProps<NoResultsProps>(), {
  isFavoritesList: false,
});

const customMessage = computed(() => {
  if (props.isFavoritesList) {
    return "No favorites here! Go add someone!";
  }

  return "No results here! Get out!";
});
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.no-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-8x);
  align-items: center;
  text-align: center;

  @include mixins.breakpointTablet {
    gap: var(--space-16x);
  }

  &__image {
    width: 100%;
  }

  &__label {
    max-width: var(--no-results-label-max-width);
  }
}
</style>
