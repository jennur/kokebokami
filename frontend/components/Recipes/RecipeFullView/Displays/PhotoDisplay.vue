<template>
  <div class="recipe__image-wrap">
    <div class="flex-column flex-column--align-right">
      <button
        v-if="editMode && !loading"
        class="button button--small button--dynamic button--cancel margin-bottom--medium"
        @click="toggleEditMode"
      >
        ✕ {{ $t("cancel") }}
      </button>
    </div>
    <div
      v-if="!loading"
      class="recipe__image"
      :style="`background-image: url(${photoURL || backupImage})`"
    >
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        class="icon recipe__image-edit-btn"
        @click="toggleEditMode"
      />
      <photo-edit
        class="recipe__image--edit"
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
    saveImage(fileURL) {
      this.editMode = false;
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        console.log("Setting new image:", fileURL);
        let imageRef = this.$fire.database.ref(`recipes/${recipeKey}/photoURL`);
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
