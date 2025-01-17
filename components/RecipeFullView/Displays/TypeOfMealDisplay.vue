<template>
  <div class="recipe_category-note margin-top-sm">
    <p class="margin-top-sm margin-bottom-sm">
      <b>{{ $t("recipes.typeOfMeal") }}:</b>
      <span
        v-if="!editMode && !loading"
        class="recipe_type-of-meal"
        :class="{ editable: isRecipeOwner }"
        @click="(event) => toggleEditMode(event)"
        >{{ typeOfMealList }}</span
      >
      <edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !typeOfMealList && !editMode"
        class="icon"
        @click="(event) => toggleEditMode(event)"
      />
      <category-edit
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
import { getDatabase, ref } from "firebase/database";
import CategoryEdit from "./Editing/CategoryEdit.vue";
import { useRecipeStore } from "~/store";

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
    required: true
  },
});

const editMode = ref(false);
const loading = ref(false);

const typeOfMealList = computed(() => {
  let allTypesOfMeal = recipeStore.allCategories.typeOfMeal;
  let localetypeOfMeal = tm("recipes.allCategories.typeOfMeal");

  return props.typeOfMeal
    .map((type) => {
      let index = allTypesOfMeal.indexOf(type);
      type = localetypeOfMeal[index].body.static;
      return type.charAt(0).toUpperCase() + type.slice(1, type.length);
    })
    .join(", ");
});

const allTypesOfMeal = computed(() => {
  return recipeStore.allCategories.typeOfMeal;
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
    const db = getDatabase();

    set(db, ref(db, `recipes/${props.recipeKey}/typeOfMeal`), types)
      .then(() => {
        console.info("[saveTypesOfMeal] Successfully updated type of meal");
        loading.value = false;
        emit("update");
      })
      .catch((error) => console.error("[saveTypesOfMeal]", error.message));
  } else {
    emit("update", { typeOfMeal: types });
  }
}
</script>
