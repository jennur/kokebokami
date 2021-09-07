<template>
  <button
    type="button"
    class="remove-icon"
    :title="$t('remove')"
    @click="(event)=>{this.$emit('decrement', event)}"
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: "decrement-button"
};
</script>
