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
      <i-edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        class="icon recipe_image-edit-btn"
        @click="toggleEditMode"
      />
      <PhotoEdit
        class="recipe_image--edit"
        v-if="editMode && !loading"
        :photoURL="photoURL"
        :recipeKey="recipeKey"
        @loading="setLoading"
        @save="saveImage"
      />
    </div>
    <div v-if="loading" class="flex-center-container">
      <span class="simple-loading-spinner"></span>
    </div>
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";

import PhotoEdit from "./Editing/PhotoEdit.vue";

const db = getDatabase();
const emit = defineEmits(["update"]);

const props = defineProps({
  photoURL: {
    type: String,
    default: "",
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

const backupImage = computed(() => {
  return new URL("@/assets/images/recipe-backup-img.png", import.meta.url).href;
});

function toggleEditMode() {
  editMode.value = !editMode.value;
}

function setLoading() {
  loading.value = true;
}

function saveImage(fileURL) {
  editMode.value = false;

  if (props.recipeKey) {
    set(dbRef(db, `recipes/${props.recipeKey}/photoURL`), fileURL)
      .then(() => {
        console.info("[saveImage] Successfully updated recipe photo");
        emit("update");
      })
      .then(() => {
        loading.value = false;
      })
      .catch((error) => console.error("[saveImage]", error.message));
  } else {
    loading.value = false;
    emit("update", { photoURL: fileURL });
  }
}
</script>
