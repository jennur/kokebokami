<template>
  <button class="button--increment" @click="() => emit('increment')">
    <slot></slot>
  </button>
</template>
<script setup>
const emit = defineEmits(["increment"]);
</script>
