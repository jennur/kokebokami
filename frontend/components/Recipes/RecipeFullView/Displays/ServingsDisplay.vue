<template>
  <div
    id="servings"
    class="recipe__servings-wrap flex-row flex-row--align-center margin-vertical--xxlarge"
  >
    <span
      v-if="!servings && !editMode && !loading"
      class="recipe__servings-disabled-dash"
      >-</span
    >
    <input
      v-if="!editMode && !loading"
      class="recipe__servings margin-right--medium"
      type="Number"
      min="1"
      step="1"
      v-model="updatedServings"
      @change="$emit('updateServings', updatedServings)"
      :disabled="!servings"
    />
    <span v-if="loading" class="simple-loading-spinner"></span>
    <h4
      class="margin--none margin-bottom--small"
      :class="{ disabled: !servings }"
    >
      {{ !servings ? "Servings 🤷" : "Servings" }}
    </h4>
    <servings-edit
      v-if="editMode"
      :servings="defaultServings"
      @save="saveServings"
    />

    <edit-icon
      v-if="isRecipeOwner && !editMode"
      @click="toggleEditMode"
      class="icon margin-left--medium"
    />
  </div>
</template>

<script>
import ServingsEdit from "./Editing/ServingsEdit.vue";

export default {
  name: "servings-display",
  components: {
    ServingsEdit
  },
  props: {
    servings: {
      type: String,
      default: ""
    },
    defaultServings: {
      type: String,
      default: ""
    },
    recipeKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      updatedServings: this.servings,
      editMode: false,
      loading: false
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveServings(servings) {
      this.editMode = false;
      if (servings !== this.servings) {
        this.loading = true;
        let servingsRef = this.$fireDb.ref(
          `recipes/${this.recipeKey}/servings`
        );
        servingsRef
          .set(servings)
          .then(() => {
            console.log("Successfully updated servings");
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error =>
            console.log("Error setting servings:", error.message)
          );
      }
    }
  }
};
</script>
