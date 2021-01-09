<template>
  <div
    id="servings"
    class="recipe_servings-wrap flex-row flex-row--align-center margin-vertical-2xl"
  >
    <span
      v-if="!servings && !editMode && !loading"
      class="recipe_servings-disabled-dash"
      >-</span
    >
    <input
      v-if="servings && !editMode && !loading"
      class="recipe_servings margin-right-md"
      type="Number"
      min="1"
      step="1"
      v-model="updatedServings"
      @change="$emit('update-servings', updatedServings)"
      :disabled="!servings"
    />
    <span v-if="loading" class="simple-loading-spinner"></span>
    <h4
      class="margin--none margin-top-sm margin-bottom-sm"
      :class="{ disabled: !servings && !editMode }"
    >
      {{ servingsTitle }}
    </h4>
    <servings-edit
      v-if="editMode"
      :servings="defaultServings"
      @save="saveServings"
    />

    <edit-icon
      tabindex="0"
      v-if="isRecipeOwner && !editMode"
      @click="toggleEditMode"
      class="icon margin-left-md"
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
  computed: {
    servingsTitle() {
      let servings;
      if (this.editMode) {
        servings = parseInt(this.defaultServings);
      } else {
        servings = parseInt(this.updatedServings);
      }
      if (!servings && !this.editMode)
        return `${this.$t("recipes.servings")} 🤷`;
      if (servings > 1 || this.editMode) return this.$t("recipes.servings");
      if (servings === 1) return this.$t("recipes.serving");
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveServings(servings) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey && servings !== this.defaultServings) {
        this.loading = true;
        let servingsRef = this.$fire.database.ref(`recipes/${recipeKey}/servings`);
        servingsRef
          .set(servings)
          .then(() => {
            console.log("Successfully updated servings");
            this.updatedServings = parseInt(servings);
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error =>
            console.log("Error setting servings:", error.message)
          );
      } else if (!recipeKey) {
        this.$emit("update", { servings });
      }
    }
  }
};
</script>
