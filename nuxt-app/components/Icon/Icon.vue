<template>
  <component
    :is="icon"
    v-if="icon"
    :class="['icon', sizeClass, colorClass]"
  ></component>
</template>

<script setup lang="ts">
interface IconProps {
  name: string;
  color?: "primary" | "default";
  size?: "s" | "m" | "l";
}

const props = withDefaults(defineProps<IconProps>(), {
  color: "default",
  size: "s",
});

const iconExists = shallowRef(false);
const icon = shallowRef();

const colorClass = computed(() => `icon--${props.color}`);
const sizeClass = computed(() => `icon--${props.size}`);

/**
 * dynamically imports and loads an icon component when the component is mounted.
 *
 *
 * if the icon is imported, it's converted to an async component
 *
 */
onMounted(async () => {
  try {
    const iconComponent = await import(`./Icons/${props.name}Icon.vue`);
    icon.value = defineAsyncComponent(() => Promise.resolve(iconComponent));
  } catch (error) {
    console.warn(`Icon ${props.name} not found`);
  }
});
</script>

<style lang="scss" scoped>
.icon {
  color: currentColor;
  pointer-events: none;
}

// Sizes

.icon--s {
  height: var(--space-8x);
}

.icon--m {
  height: var(--space-10x);
}

.icon--l {
  height: var(--space-12x);
}

// Colors

.icon--default {
  fill: var(--color-white);
}

.icon--primary {
  fill: var(--color-primary);
}
</style>
