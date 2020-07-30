<template>
  <div class="recipe__language">
    <div class="flex-row">
      This recipe is written in
      <span
        v-if="language && !editMode"
        @click="event => toggleEditMode(event)"
        class="margin-left--small"
        :class="{ editable: isRecipeOwner }"
        >{{ language }}</span
      >
      <edit-icon
        v-if="!language && isRecipeOwner && !editMode"
        class="icon"
        @click="event => toggleEditMode(event)"
      />
      <language-edit
        class="margin-left--small"
        v-if="editMode"
        :language="language"
        @update="setLanguage"
        @close="toggleEditMode"
      />
    </div>
  </div>
</template>
<script>
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
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        let languageRef = this.$fireDb.ref(`recipes/${recipeKey}/language`);
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
