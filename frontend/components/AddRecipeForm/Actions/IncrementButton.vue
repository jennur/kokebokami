<template>
  <button class="add-recipe-form__add-input-btn" @click="() => {this.$emit('increment')}">
    <slot />
  </button>
</template>
<script>
export default {
  name: "increment-button"
};
</script>
