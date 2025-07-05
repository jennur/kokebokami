<template>
  <button
    type="button"
    class="remove-icon"
    :title="$t('remove')"
    @click="(event) => emit('decrement', event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(["decrement"]);
</script>
