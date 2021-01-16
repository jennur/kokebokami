<template>
  <div id="servings" class="recipe_servings-wrap margin-vertical-lg">
    <div class="flex-row flex-row--align-center">
      <h4
        class="margin--none margin-top-sm margin-bottom-sm"
        :class="{ disabled: !servings && !editMode }"
      >
        {{ $t("recipes.servings") }}
        <span v-if="!servings && !editMode && !loading">
          🤷🏾‍♂️
        </span>
      </h4>

      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        @click="toggleEditMode"
        class="icon margin-left-md"
      />
    </div>

    <div v-if="servings && !editMode && !loading" class="recipe_servings-w-btns">
      <button class="servings-btn" @click="decrement">-</button>
      <span class="recipe_servings">{{updatedServings}}</span>
      <button class="servings-btn" @click="increment">+</button>
    </div>

    <span v-if="loading" class="simple-loading-spinner"></span>

    <servings-edit
      v-if="editMode"
      :servings="defaultServings"
      @save="saveServings"
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
    decrement(){
      if(this.updatedServings > 1) {
        this.updatedServings--;
        this.$emit('update-servings', this.updatedServings);
      }
    },
    increment(){
      this.updatedServings++;
      this.$emit('update-servings', this.updatedServings);
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
