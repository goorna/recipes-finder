<template>
  <div class="layout">
    <Modal v-if="isOpen" :id="recipeId" />
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";
import { useModalStore } from "~/stores/modal";

const route = useRoute();

const { isOpen, recipeId } = storeToRefs(useModalStore());

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
