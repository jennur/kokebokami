<template>
  <div>
    <div class="flex-row flex-row--align-center flex-row--nowrap">
      <h3 class="margin-v-md">{{ $t("recipes.instructions") }}</h3>
      <i-edit-icon
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
        tabindex="0"
        class="recipe_instructions-step"
        :class="{ focused: focusedIndex === index }"
        v-for="(step, index) in instructions"
        :key="`instruction-${index}`"
        :id="`step${index + 1}`"
        @click="focusedIndex = index"
      >
        {{ step }}
      </li>
    </ol>
    <span v-if="loading" class="simple-loading-spinner"></span>
    <InstructionsEdit
      v-if="editMode"
      :instructions="instructions"
      @save="saveInstructions"
    />
  </div>
</template>
<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import InstructionsEdit from "./Editing/InstructionsEdit.vue";

const db = getDatabase();
const props = defineProps({
  instructions: {
    type: Array,
    default: () => [],
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
  recipeKey: {
    type: String,
    default: "",
  },
});

const emit = defineEmits("update");

const editMode = ref(false);
const loading = ref(false);
const focusedIndex = ref(null);

function toggleEditMode() {
  editMode.value = !editMode.value;
}

function saveInstructions(instructions) {
  editMode.value = false;

  if (props.recipeKey) {
    loading.value = true;

    set(dbRef(db, `recipes/${props.recipeKey}/instructions`), instructions)
      .then(() => {
        console.info("[saveInstructions] Successfully updated instructions");
        emit("update");
      })
      .catch((error) =>
        console.error(
          "[saveInstructions] Error setting instructions:",
          error.message
        )
      )
      .finally(() => {
        loading.value = false;
      });
  } else {
    emit("update", { instructions });
  }
}
</script>
