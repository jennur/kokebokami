<template>
  <div class="flex-row flex-row--align-center flex-row--justify-center">
    <div class="margin-top--xlarge margin-right--xlarge margin-bottom--xlarge">
      <button
        v-if="editMode"
        @click="() => {this.$emit('deleteRecipe')}"
        class="button button--small button--red-border"
      >Delete recipe</button>
    </div>
    <button @click="() => {this.$emit('save')}" class="button button--small">Save recipe</button>
    <button
      @click="() => {this.$emit('cancel')}"
      class="button button--large button--cancel margin--large"
    >✕ Cancel</button>
  </div>
</template>
<script>
export default {
  name: "save-section",
  props: {
    editMode: { type: Boolean, default: false }
  }
};
</script>
