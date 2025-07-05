<template>
  <div>
    <div v-if="!editMode && !loading" class="recipe_categories margin-top-lg">
      <span
        class="recipe_category margin-right-md"
        v-for="(category, index) in categories"
        :class="{ editable: isRecipeOwner, edit: beforeEdit === index }"
        :key="`category-${index}`"
      >
        <span @click="() => toggleEditClass(index)">{{
          categoryNames[index]
        }}</span>

        <i-edit-icon
          tabindex="0"
          class="icon recipe_category-edit-icon"
          @click="toggleEditMode"
        />
      </span>

      <button
        v-if="!categories.length"
        class="button button-xs button--round"
        @click="toggleEditMode"
      >
        {{ $t("recipes.addCategory") }}
      </button>
    </div>
    <CategoryEdit
      v-if="editMode"
      :allTypes="allCategories"
      :existingTypes="categories"
      orange
      @save="saveCategories"
    />
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { useRecipeStore } from "~/store";
import CategoryEdit from "./Editing/CategoryEdit.vue";

const { tm } = useI18n();

const recipeStore = useRecipeStore();

const emit = defineEmits(["update"]);

const props = defineProps({
  categories: {
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
const beforeEdit = ref(null);

const allCategories = computed(() => {
  return recipeStore.allCategories.categories;
});
const categoryNames = computed(() => {
  const allCategories = recipeStore.allCategories.categories;
  const localeCategories = tm("recipes.allCategories.categories");
  return (
    props.categories &&
    props.categories.map((category) => {
      const index = allCategories.indexOf(category);
      return localeCategories[index];
    })
  );
});

function toggleEditClass(index) {
  if (index === beforeEdit.value) index = null;
  beforeEdit.value = index;
}

function toggleEditMode(event) {
  event && event.stopPropagation();
  editMode.value = !editMode.value;
}

function saveCategories(categories) {
  editMode.value = false;

  if (props.recipeKey) {
    loading.value = true;
    const db = getDatabase();

    set(dbRef(db, `recipes/${props.recipeKey}/categories`), categories)
      .then(() => {
        console.info("[saveCategories] Successfully updated categories");
        loading.value = false;
        emit("update");
      })
      .catch((error) => console.error("[saveCategories]", error.message));
  } else {
    emit("update", { categories });
  }
}
</script>
