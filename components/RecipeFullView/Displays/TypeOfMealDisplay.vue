<template>
  <div class="recipe_category-note margin-top-sm">
    <p class="margin-top-sm margin-bottom-sm">
      <b>{{ $t("recipes.typeOfMeal") }}:</b>
      <span
        v-if="!editMode && !loading"
        class="recipe_type-of-meal"
        :class="{ editable: isRecipeOwner }"
        @click="toggleEditMode"
        >{{ typeOfMealList }}</span
      >
      <i-edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !typeOfMealList && !editMode"
        class="icon"
        @click="toggleEditMode"
      />
      <CategoryEdit
        v-if="editMode"
        :existingTypes="typeOfMeal"
        :allTypes="allTypesOfMeal"
        @save="saveTypesOfMeal"
      />
      <span v-if="loading" class="simple-loading-spinner"></span>
    </p>
  </div>
</template>
<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";
import CategoryEdit from "./Editing/CategoryEdit.vue";
import { useRecipeStore } from "~/store";

const db = getDatabase();
const recipeStore = useRecipeStore();
const { tm } = useI18n();

const emit = defineEmits(["update"]);

const props = defineProps({
  typeOfMeal: {
    type: Array,
    default: () => [],
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
  recipeKey: {
    type: String,
    required: true,
  },
});

const editMode = ref(false);
const loading = ref(false);

const allTypesOfMeal = computed(() => {
  return recipeStore.allCategories.typeOfMeal;
});

const typeOfMealList = computed(() => {
  const localetypeOfMeal = tm("recipes.allCategories.typeOfMeal");

  return props.typeOfMeal
    .map((type) => {
      const index = allTypesOfMeal.value.indexOf(type);
      type = localetypeOfMeal[index];
      return type.charAt(0).toUpperCase() + type.slice(1, type.length);
    })
    .join(", ");
});

function toggleEditMode(event) {
  event && event.stopPropagation();
  if (props.isRecipeOwner) {
    editMode.value = !editMode.value;
  }
}

function saveTypesOfMeal(types) {
  editMode.value = false;

  if (props.recipeKey) {
    loading.value = true;

    try {
      set(dbRef(db, `recipes/${props.recipeKey}/typeOfMeal`), types)
        .then(() => {
          console.info("[saveTypesOfMeal] Successfully updated type of meal");
          emit("update");
        })
        .catch((error) => {
          console.error("[saveTypesOfMeal]", error.message);
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (error) {
      console.error("[saveTypesOfMeal]", error.message);
    }
  } else {
    emit("update", { typeOfMeal: types });
  }
}
</script>
