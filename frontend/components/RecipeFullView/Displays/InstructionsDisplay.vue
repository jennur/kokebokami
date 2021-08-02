<template>
  <div>
    <div class="flex-row flex-row--align-center flex-row--nowrap">
      <h4 class="margin-v-md">{{ $t("recipes.instructions") }}</h4>
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        class="icon margin-md"
        @click="toggleEditMode"
      />
    </div>
    <ol
      v-if="instructions.length && !editMode && !loading"
      class="recipe_instructions"
    >
      <li
        tabindex="-1"
        class="recipe_instructions-step"
        v-for="(step, index) in instructions"
        :key="`instruction-${index}`"
      >
        {{ step }}
      </li>
    </ol>
    <span v-if="loading" class="simple-loading-spinner"></span>
    <instructions-edit
      v-if="editMode"
      :instructions="instructions"
      @save="saveInstructions"
    />
  </div>
</template>
<script>
import InstructionsEdit from "./Editing/InstructionsEdit.vue";

export default {
  name: "instructions-display",
  components: {
    InstructionsEdit
  },
  props: {
    instructions: {
      type: Array,
      default: () => []
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editMode: false,
      loading: false
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveInstructions(instructions) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        this.loading = true;
        let instructionsRef = this.$fire.database.ref(
          `recipes/${recipeKey}/instructions`
        );
        instructionsRef
          .set(instructions)
          .then(() => {
            console.log("Successfully updated instructions");
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error =>
            console.log("Error setting instructions:", error.message)
          );
      } else {
        this.$emit("update", { instructions });
      }
    }
  }
};
</script>
