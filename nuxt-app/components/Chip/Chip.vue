<template>
  <div class="chip">
    <span class="label-m text-color-white">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
export interface ChipProps {
  label: string;
}

const props = defineProps<ChipProps>();
</script>

<style lang="scss" scoped>
.chip {
  display: flex;
  padding: var(--space-2x) var(--space-4x);
  background-color: var(--color-primary-dark);
  border-radius: var(--border-radius-16);
}
</style>
