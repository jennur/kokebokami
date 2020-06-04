<template>
  <div>
    <fieldset class="margin-top--xxlarge" v-if="!saved">
      <div
        v-if="!deleted"
        class="flex-row flex-row--align-center flex-row--justify-center"
      >
        <button
          v-if="editMode"
          @click="
            () => {
              this.$emit('deleteRecipe');
            }
          "
          class="delete-button button button--small button--red-border"
        >
          Delete recipe
        </button>

        <button
          @click="
            () => {
              this.$emit('save');
            }
          "
          class="save-button button button--small"
        >
          Save recipe
        </button>
        <button
          @click="
            () => {
              this.$emit('cancel');
            }
          "
          class="cancel-button button button--small button--cancel"
        >
          ✕ Cancel
        </button>
      </div>
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="deleted" to="/account/my-cookbook/"
        >Go back to your cookbook</nuxt-link
      >
    </fieldset>

    <div
      class="flex-center-container flex-center-container--column margin--auto"
      v-else-if="saved && recipeKey"
    >
      <div class="system-message">{{ systemMessage }}</div>
      <nuxt-link v-if="recipeKey !== ''" :to="'/recipes/' + recipeKey"
        >Look at your new recipe ➔</nuxt-link
      >
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
