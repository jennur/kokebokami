<template>
  <div>
    <h2
      v-if="!editTitle && !loading"
      class="recipe__title"
      :class="{ editable: isRecipeOwner }"
      @click="event => toggleEditTitle(event)"
    >
      {{ recipeTitle }}
    </h2>
    <span v-if="loading" class="simple-loading-spinner"></span>
    <title-edit
      v-if="isRecipeOwner && editTitle"
      :title="title"
      @save="saveTitle"
    />
  </div>
</template>

<script>
import TitleEdit from "./Editing/TitleEdit.vue";

export default {
  name: "title-display",
  components: {
    TitleEdit
  },
  props: {
    title: {
      type: String,
      default: ""
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
      editTitle: false,
      loading: false
    };
  },
  computed: {
    recipeTitle() {
      return this.title ? this.title : "Recipe has no title";
    }
  },
  methods: {
    toggleEditTitle(event) {
      event && event.stopPropagation();
      if (this.isRecipeOwner) {
        this.editTitle = !this.editTitle;
      }
      return false;
    },
    saveTitle(updatedTitle) {
      this.editTitle = false;
      let recipeKey = this.recipeKey;

      if (recipeKey && updatedTitle !== this.title) {
        this.loading = true;
        let titleRef = this.$fireDb.ref(`recipes/${recipeKey}/title`);
        titleRef
          .set(updatedTitle)
          .then(() => {
            console.log("Successfully updated title");
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error => console.log("Error setting title:", error.message));
      } else if (!recipeKey) {
        console.log("Saving new title", updatedTitle);
        this.$emit("update", { title: updatedTitle });
      }
    }
  }
};
</script>
