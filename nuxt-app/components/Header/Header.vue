<template>
  <header>
    <div class="header">
      <NuxtLink to="/">
        <img class="header__logo" src="/images/logo.png" alt="logo" />
      </NuxtLink>
      <div class="header__nav-items">
        <NuxtLink to="/">
          <Icon name="home" size="m" color="primary" />
          <span>Home</span>
        </NuxtLink>
        <NuxtLink to="/favourites">
          <Icon name="heart" size="m" color="primary" />
          <span>Favourites</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from "~/components/Icon/Icon.vue";
</script>

<style lang="scss" scoped>
@use "~/assets/style/mixins";

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height-mobile);
  border: 1px solid var(--color-border);
  padding: var(--space-4x) var(--space-8x);

  &__logo {
    height: var(--logo-height-mobile);

    @include mixins.breakpointDesktop {
      height: var(--logo-height-desktop);
    }
  }

  &__nav-items {
    display: inline-flex;
    gap: var(--space-16x);

    @include mixins.breakpointDesktop {
      gap: var(--space-8x);
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-4x);
      color: var(--color-primary);
      text-decoration: none;
    }

    span {
      display: none;

      @include mixins.breakpointDesktop {
        display: inline;
        padding-top: var(--space-1x);
      }
    }
  }
}
</style>
