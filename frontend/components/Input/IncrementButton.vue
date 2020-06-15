<template>
  <button
    class="button--increment"
    @click="
      () => {
        this.$emit('increment');
      }
    "
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: "increment-button"
};
</script>
