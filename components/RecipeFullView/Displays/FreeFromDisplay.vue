<template>
  <div class="recipe_category-note margin-top-sm">
    <p class="margin-top-sm margin-bottom-sm">
      <b>{{ $t("recipes.freeFrom") }}:</b>
      <span
        v-if="!editMode && !loading"
        class="recipe_type-of-meal"
        :class="{ editable: isRecipeOwner }"
        @click="(event) => toggleEditMode(event)"
        >{{ freeFromList }}</span
      >
      <EditIcon
        tabindex="0"
        v-if="isRecipeOwner && !freeFromList && !editMode"
        class="icon"
        @click="(event) => toggleEditMode(event)"
      />
      <CategoryEdit
        v-if="editMode"
        :existingTypes="freeFrom"
        :allTypes="allFreeFrom"
        @save="saveFreeFrom"
      />
      <span v-if="loading" class="simple-loading-spinner"></span>
    </p>
  </div>
</template>
<script setup>
import { getDatabase, ref, get } from "firebase/database";
import CategoryEdit from "./Editing/CategoryEdit.vue";
import { useRecipeStore } from "~/store";
const recipeStore = useRecipeStore();

const emit = defineEmits(["update"]);

const props = defineProps({
  freeFrom: {
    type: Array,
    default: () => [],
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

const freeFromList = computed(() => {
  let allAllergens = recipeStore.allCategories.allergens;
  let localeAllergens = this.$t("recipes.allCategories.allergens");
  return this.freeFrom
    .map((type) => {
      let index = allAllergens.indexOf(type);
      type = localeAllergens[index];
      return type.charAt(0).toUpperCase() + type.slice(1, type.length);
    })
    .join(", ");
});

const allFreeFrom = computed(() => {
  return recipeStore.allCategories.allergens;
});

function toggleEditMode(event) {
  event && event.stopPropagation();
  if (props.isRecipeOwner) {
    editMode.value = !editMode.value;
  }
}

function saveFreeFrom(allergens) {
  editMode.value = false;
  const recipeKey = props.recipeKey;

  if (recipeKey) {
    loading.value = true;
    const db = getDatabase();
    setImmediate(ref(db, `recipes/${recipeKey}/freeFrom`), allergens)
      .then(() => {
        console.log("Successfully updated free from");
        loading.value = false;
        emit("update");
      })
      .catch((error) => console.log("Error setting free from:", error.message));
  } else {
    emit("update", { freeFrom: allergens });
  }
}
</script>
