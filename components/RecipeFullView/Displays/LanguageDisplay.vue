<template>
  <div class="recipe_language">
    <div class="flex-row">
      {{ $t("recipes.writtenIn") }}
      <span
        v-if="language && !editMode"
        @click="toggleEditMode"
        :class="{ editable: isRecipeOwner }"
        class="margin-left-sm"
        >{{ language }}</span
      >
      <i-edit-icon
        v-if="!language && isRecipeOwner && !editMode"
        class="icon margin-left-sm"
        @click="toggleEditMode"
      />
      <LanguageEdit
        class="margin-left-sm"
        v-if="editMode"
        :language="language"
        @update="setLanguage"
        @close="toggleEditMode"
      />
    </div>
  </div>
</template>
<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";
import LanguageEdit from "./Editing/LanguageEdit.vue";

const db = getDatabase();

const emit = defineEmits(["update"]);

const props = defineProps({
  language: {
    type: String,
    default: "",
  },
  recipeKey: {
    type: String,
    default: "",
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
});

const editMode = ref(false);

function toggleEditMode(event) {
  event && event.stopPropagation();
  if (props.isRecipeOwner) {
    editMode.value = !editMode.value;
  }
}

function setLanguage(language) {
  language = language === "Not set" ? null : language;

  if (props.recipeKey) {
    set(dbRef(db, `recipes/${props.recipeKey}/language`), language)
      .then(() => {
        console.info("[setLanguage] Successfully updated language");
        editMode.value = false;
        emit("update");
      })
      .catch((error) =>
        console.error("[setLanguage] Error updating language:", error.message)
      );
  } else {
    emit("update", { language });
    editMode.value = false;
  }
}
</script>
