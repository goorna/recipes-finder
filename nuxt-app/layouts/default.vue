<template>
  <div class="layout">
    <Modal v-if="isOpen" :favorites="favoritesIDs" />
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";
import { useModalStore } from "~/stores/modal";
import { useFavoritesStore } from "~/stores/favorites";

const route = useRoute();

const { isOpen, recipeId } = storeToRefs(useModalStore());
const { favorites } = storeToRefs(useFavoritesStore());

const favoritesIDs = computed(() => favorites.value.map((item) => item.id));

watch(route, () => {
  if (!route.query.search) {
    const { setQuery } = useSearchStore();
    setQuery("");
  }
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  background-color: var(--color-white);
}
</style>
