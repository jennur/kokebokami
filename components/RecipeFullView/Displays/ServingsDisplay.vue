<template>
  <div id="servings" class="recipe_servings-wrap margin-bottom-lg">
    <div class="flex-row flex-row--align-center">
      <h3
        class="margin--none margin-top-sm margin-bottom-sm"
        :class="{ disabled: !servings && !editMode }"
      >
        {{ servingsTitle }}
        <span v-if="!servings && !editMode && !loading"> 🤷🏾‍♂️ </span>
      </h3>

      <i-edit-icon
        tabindex="0"
        v-if="isRecipeOwner && !editMode"
        @click="toggleEditMode"
        class="icon margin-left-md"
      />
    </div>

    <div
      v-if="servings && !editMode && !loading"
      class="recipe_servings-w-btns"
    >
      <button class="servings-btn minus" @click="decrement"></button>
      <span class="recipe_servings">{{ updatedServings }}</span>
      <button class="servings-btn plus" @click="increment"></button>
    </div>

    <span v-if="loading" class="simple-loading-spinner"></span>

    <servings-edit
      v-if="editMode"
      :servings="defaultServings"
      @save="saveServings"
    />
  </div>
</template>

<script setup>
import { getDatabase, ref as dbRef, set } from "firebase/database";
import ServingsEdit from "./Editing/ServingsEdit.vue";

const db = getDatabase();
const emit = defineEmits(["update-servings", "update"]);
const { t } = useI18n();
const props = defineProps({
  servings: String,
  defaultServings: String,
  recipeKey: String,
  isRecipeOwner: Boolean,
});

const updatedServings = ref(props.servings);
const editMode = ref(false);
const loading = ref(false);

const servingsTitle = computed(() => {
  let servings;
  if (editMode.value) servings = parseInt(props.defaultServings);
  else servings = parseInt(updatedServings.value);

  if (!servings && !editMode.value) return `${t("recipes.servings")} 🤷`;
  if (servings > 1 || editMode.value) return t("recipes.servings");
  if (servings === 1) return t("recipes.serving");
});

function toggleEditMode(event) {
  event && event.preventDefault();
  editMode.value = !editMode.value;
}

function decrement() {
  if (updatedServings.value > 1) {
    updatedServings.value--;
    emit("update-servings", updatedServings.value);
  }
}

function increment() {
  updatedServings.value++;
  emit("update-servings", updatedServings.value);
}

function saveServings(servings) {
  editMode.value = false;
  const recipeKey = props.recipeKey;

  if (recipeKey && servings !== props.defaultServings) {
    loading.value = true;

    set(dbRef(db, `recipes/${recipeKey}/servings`), servings)
      .then(() => {
        console.info("[saveServings] Successfully updated servings");
        updatedServings.value = parseInt(servings);
        emit("update");
      })
      .then(() => {
        loading.value = false;
      })
      .catch((error) => console.error("[saveServings]", error.message));
  } else if (!recipeKey) {
    emit("update", { servings });
  }
}
</script>
