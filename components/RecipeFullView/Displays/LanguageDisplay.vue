<template>
  <div class="recipe_language">
    <div class="flex-row">
      {{ $t("recipes.writtenIn") }}
      <span
        v-if="language && !editMode"
        @click="event => toggleEditMode(event)"
        :class="{ editable: isRecipeOwner }"
        class="margin-left-sm"
        >{{ language }}</span
      >
      <edit-icon
        v-if="!language && isRecipeOwner && !editMode"
        class="icon margin-left-sm"
        @click="event => toggleEditMode(event)"
      />
      <language-edit
        class="margin-left-sm"
        v-if="editMode"
        :language="language"
        @update="setLanguage"
        @close="toggleEditMode"
      />
    </div>
  </div>
</template>
<script>
import { getDatabase, ref, get } from "firebase/database";

import LanguageEdit from "./Editing/LanguageEdit.vue";

export default {
  name: "language-display",
  components: {
    LanguageEdit
  },
  props: {
    language: {
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
      editMode: false
    };
  },
  methods: {
    toggleEditMode(event) {
      event && event.stopPropagation();
      if (this.isRecipeOwner) {
        this.editMode = !this.editMode;
      }
    },
    setLanguage(language) {
      language = language === "Not set" ? null : language;
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        const db = getDatabase();
        let languageRef = ref(db, `recipes/${recipeKey}/language`);
        languageRef
          .set(language)
          .then(() => {
            console.log("Successfully updated language");
            this.editMode = false;
            this.$emit("update");
          })
          .catch(error =>
            console.log("Error updating language:", error.message)
          );
      } else {
        this.$emit("update", { language });
        this.editMode = false;
      }
    }
  }
};
</script>
