<template>
  <div class="flex-row flex-row--align-center flex-row--justify-center">
    <button class="button" @click="() => {this.$emit('save')}">Save recipe</button>
    <button class="button button--cancel" @click="() => {this.$emit('cancel')}">✕ Cancel</button>
  </div>
</template>
<script>
export default {
  name: "save-section"
};
</script>
