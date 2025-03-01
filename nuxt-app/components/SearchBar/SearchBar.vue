<template>
  <div class="searchbar">
    <input
      class="searchbar__input"
      v-model="searchBarQuery"
      placeholder="Type to search..."
      type="search"
      @input="handleSearchChange"
    />
    <span class="label-xs text-color-primary">Search by ingredient or recipe name</span>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";

const { query } = storeToRefs(useSearchStore());
const { setQuery } = useSearchStore();

const searchBarQuery = ref(query);

const handleSearchChange = () => {
  setQuery(searchBarQuery.value);
};
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.searchbar {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: var(--space-2x);
  padding: var(--space-16x) var(--space-8x) 0;

  &__input {
    width: 100%;
    padding: var(--space-4x) var(--space-4x);
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius-8);

    @include mixins.breakpointDesktop {
      width: var(--searchbar-width-desktop);
    }
  }
}
</style>
