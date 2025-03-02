<template>
  <div class="layout">
    <Header />
    <div class="layout__error-page">
      <NoResults />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout {
  &__error-page {
    padding: var(--space-16x) var(--space-8x);
    gap: var(--space-8x);
    display: flex;
    justify-content: center;
  }
}
</style>
