<template>
  <button class="remove-icon" title="Remove" @click="(event)=>{this.$emit('decrement', event)}">
    <slot />
  </button>
</template>
<script>
export default {
  name: "decrement-button"
};
</script>
