<template>
  <div>
    <fieldset class="margin-top--xxlarge" v-if="!saved">
      <div v-if="!deleted" class="flex-row flex-row--align-center flex-row--justify-center">
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
          class="button button--small button--cancel margin--large"
        >✕ Cancel</button>
      </div>
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="deleted" to="/my-recipes">Go back to your cook book</nuxt-link>
    </fieldset>

    <div
      class="flex-center-container flex-center-container--column margin--auto"
      v-else-if="saved && recipeKey"
    >
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="recipeKey !== ''" :to="'/recipes/' + recipeKey">Look at your new recipe ➔</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "save-actions",
  props: {
    recipeKey: { type: String, default: "" },
    editMode: { type: Boolean, default: false },
    saved: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    systemMessage: { type: String, default: "" }
  }
};
</script>
