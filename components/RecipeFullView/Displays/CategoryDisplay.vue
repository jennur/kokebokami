<template>
  <div>
    <div v-if="!editMode && !loading" class="recipe_categories margin-top-lg">
      <span
        class="recipe_category margin-right-md"
        v-for="(category, index) in categories"
        :class="{ editable: isRecipeOwner, edit: beforeEdit === index }"
        :key="`category-${index}`"
      >
        <span @click="toggleEditClass(index)">{{ categoryNames[index] }}</span>

        <edit-icon
          tabindex="0"
          class="icon recipe_category-edit-icon"
          @click="(event) => toggleEditMode(event)"
        />
      </span>

      <button
        v-if="!categories.length"
        class="button button-xs button--round"
        @click="(event) => toggleEditMode(event)"
      >
        {{ $t("recipes.addCategory") }}
      </button>
    </div>
    <category-edit
      v-if="editMode"
      :allTypes="allCategories"
      :existingTypes="categories"
      orange
      @save="saveCategories"
    />
  </div>
</template>
<script setup>
import { getDatabase, ref, get } from "firebase/database";
import CategoryEdit from "./Editing/CategoryEdit.vue";
import { useRecipeStore } from "~/store";

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
  const localeCategories = t("recipes.allCategories.categories");
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
  const recipeKey = props.recipeKey;

  if (recipeKey) {
    loading.value = true;
    const db = getDatabase();
    set(ref(db, `recipes/${recipeKey}/categories`), categories)
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
