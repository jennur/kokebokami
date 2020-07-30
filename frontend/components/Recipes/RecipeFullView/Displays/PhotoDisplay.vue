<template>
  <div class="recipe__image-wrap">
    <div
      v-if="!editMode && !loading"
      class="recipe__image"
      :style="`background-image: url(${photoURL || backupImage})`"
    >
      <edit-icon
        v-if="isRecipeOwner"
        class="icon recipe__image-edit-btn"
        @click="toggleEditMode"
      />
    </div>
    <div v-if="loading" class="flex-center-container">
      <span class="simple-loading-spinner"></span>
    </div>
    <photo-edit
      v-if="editMode"
      v-show="editMode && !loading"
      :photoURL="photoURL"
      :recipeKey="recipeKey"
      @save="photoURL => saveImage(photoURL)"
      @loading="setLoading"
    />
    <button
      v-if="editMode && !loading"
      class="button button--dynamic-small button--cancel margin-top--large"
      @click="toggleEditMode"
    >
      ✕ Cancel
    </button>
  </div>
</template>
<script>
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
      return require("~/assets/images/recipe-backup-img.png");
    }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    setLoading() {
      this.loading = true;
    },
    saveImage(photoURL) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        let imageRef = this.$fireDb.ref(`recipes/${recipeKey}/photoURL`);
        imageRef
          .set(photoURL)
          .then(() => {
            console.log("Successfully updated recipe photo");
            this.$emit("update");
          })
          .then(() => (this.loading = false))
          .catch(error =>
            console.log("Error updating recipe photo:", error.message)
          );
      } else {
        this.$emit("update", { photoURL });
        this.loading = false;
      }
    }
  }
};
</script>
