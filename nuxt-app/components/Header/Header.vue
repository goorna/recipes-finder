<template>
  <header>
    <div class="header">
      <a href="/">
        <NuxtImg
          class="header__logo"
          src="/images/logo.png"
          alt="recipe-finder-logo"
        />
      </a>
      <nav class="header__nav-items">
        <a href="/">
          <Icon name="home" size="m" color="primary" />
          <span>Home</span>
        </a>
        <a href="/favorites">
          <Icon name="heart" size="m" color="primary" />
          <span>Favorites</span>
        </a>
      </nav>
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
    gap: var(--space-4x);

    @include mixins.breakpointDesktop {
      gap: var(--space-8x);
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-4x);
      color: var(--color-primary);
      text-decoration: none;
      padding: var(--space-4x);
      outline: none;

      &:hover {
        border-radius: var(--border-radius-8);
        background-color: var(--color-hover, rgba(0, 0, 0, 0.05));
      }

      &[aria-current="page"] {
        font-weight: bold;
      }
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
