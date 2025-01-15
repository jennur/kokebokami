<template>
  <div class="recipe_image-wrap">
    <div class="flex-column flex-column--align-right">
      <button
        v-if="editMode && !loading"
        class="button button-sm button--dynamic button--cancel margin-bottom-md"
        @click="toggleEditMode"
      >
        ✕ {{ $t("cancel") }}
      </button>
    </div>
    <div
      v-if="!loading"
      class="recipe_image"
      :style="`background-image: url(${photoURL || backupImage})`"
    >
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        class="icon recipe_image-edit-btn"
        @click="toggleEditMode"
      />
      <photo-edit
        class="recipe_image--edit"
        v-if="editMode && !loading"
        :photoURL="photoURL"
        :recipeKey="recipeKey"
        @loading="setLoading"
        @save="fileURL => saveImage(fileURL)"
      />
    </div>
    <div v-if="loading" class="flex-center-container">
      <span class="simple-loading-spinner"></span>
    </div>
  </div>
</template>
<script>
import { getDatabase, ref, get } from "firebase/database";

import PhotoEdit from "./Editing/PhotoEdit.vue";

export default {
  name: "photo-display",
  components: {
    PhotoEdit
  },
  props: {
    photoURL: {
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
      editMode: false,
      loading: false
    };
  },
  computed: {
    backupImage() {
      return require("assets/images/recipe-backup-img.png");
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    setLoading() {
      this.loading = true;
    },
    saveImage(fileURL) {
      this.editMode = false;
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        const db = getDatabase();
        let imageRef = ref(db, `recipes/${recipeKey}/photoURL`);
        imageRef
          .set(fileURL)
          .then(() => {
            console.log("Successfully updated recipe photo");
            this.$emit("update");
          })
          .then(() => {
            this.loading = false;
          })
          .catch(error =>
            console.log("Error updating recipe photo:", error.message)
          );
      } else {
        this.loading = false;
        this.$emit("update", { photoURL: fileURL });
      }
    }
  }
};
</script>
