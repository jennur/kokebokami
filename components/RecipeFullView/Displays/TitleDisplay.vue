<template>
  <div>
    <h2
      v-if="!editTitle && !loading"
      class="recipe_title margin-bottom-xl"
      :class="{ editable: isRecipeOwner }"
      @click="(event) => toggleEditTitle(event)"
    >
      {{ title }}
    </h2>
    <span v-if="loading" class="simple-loading-spinner"></span>
    <TitleEdit
      class="margin-bottom-xl"
      v-if="isRecipeOwner && editTitle"
      :title="title"
      @save="saveTitle"
    />
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import TitleEdit from "./Editing/TitleEdit.vue";

const db = getDatabase();
const emit = defineEmits(["update"]);
const props = defineProps({
  title: {
    type: String,
    default: "Recipe has no title",
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

const editTitle = ref(false);
const loading = ref(false);

function toggleEditTitle(event) {
  event && event.stopPropagation();
  if (props.isRecipeOwner) {
    editTitle.value = !editTitle.value;
  }
  return false;
}

function saveTitle(newTitle) {
  editTitle.value = false;
  const recipeKey = props.recipeKey;

  if (recipeKey && newTitle !== props.title) {
    loading.value = true;
    const titleRef = dbRef(db, `recipes/${recipeKey}/title`);
    set(titleRef, newTitle)
      .then(() => {
        console.info("[saveTitle] Successfully updated title");
        emit("update");
      })
      .catch((error) => console.error("[saveTitle]", error.message))
      .finally(() => {
        loading.value = false;
      });
  } else if (!recipeKey) {
    console.info("[saveTitle] Saving new title", newTitle);
    emit("update", { title: newTitle });
  }
}
</script>
