<template>
  <div>
    <div
      v-if="!editMode && !loading"
      class="recipe_description"
      :class="{ editable: isRecipeOwner }"
      @click="toggleEditMode"
    >
      {{ description }}
    </div>
    <DescriptionEdit
      v-if="isRecipeOwner && editMode"
      :description="description"
      @save="saveDescription"
    />
    <span v-if="loading" class="simple-loading-spinner"></span>
  </div>
</template>
<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import DescriptionEdit from "./Editing/DescriptionEdit.vue";

const db = getDatabase();

const emit = defineEmits(["update"]);

const props = defineProps({
  description: {
    type: String,
    default: "Recipe has no description",
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

const editMode = ref(false);
const loading = ref(false);

function toggleEditMode(event) {
  event && event.stopPropagation();
  if (props.isRecipeOwner) {
    editMode.value = !editMode.value;
  }
}

function saveDescription(newDescription) {
  editMode.value = false;

  if (props.recipeKey && newDescription !== props.description) {
    loading.value = true;

    set(dbRef(db, `recipes/${props.recipeKey}/description`), newDescription)
      .then(() => {
        console.info("[saveDescription] Successfully updated Description");
        emit("update");
      })
      .then(() => {
        loading.value = false;
      })
      .catch((error) => console.error("[saveDescription]", error.message));
  } else if (!props.recipeKey) {
    emit("update", { description: newDescription });
  }
}
</script>
