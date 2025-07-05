<template>
  <div class="recipe-link-edit-form">
    <form>
      <fieldset class="flex-column">
        <label for="url">Recipe URL</label>
        <input
          v-model="url"
          ref="urlInput"
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com/recipe-url/"
          class="recipe-link-edit-form_url"
        />
        <span class="recipe-link-edit-form--required">*</span>
      </fieldset>
      <ExpandTransition :show="!!errorMessage">
        <div class="system-message">{{ errorMessage }}</div>
      </ExpandTransition>
      <fieldset class="flex-column">
        <label for="title">Title</label>
        <input
          v-model="title"
          ref="titleInput"
          type="text"
          name="title"
          id="title"
          placeholder="My custom title"
          class="recipe-link-edit-form_title"
        />
      </fieldset>
      <fieldset class="flex-column">
        <label for="category">Category</label>
        <div class="flex-row flex-row--align-center">
          <SelectComponent
            ref="categorySelect"
            id="category-select"
            name="category-select"
            class="select--green margin-right-md margin-top-md"
            :options="categories"
            defaultValue="No category"
            :preSelected="selectedCategory"
            @select="(option) => handleSelect(option)"
          />
          <button
            v-if="!newCategory"
            class="recipe-link-edit-form_category-btn button button-xs button--green button--round margin-top-md"
            @click.prevent="addNewCategory"
          >
            New category
          </button>
          <input
            v-if="newCategory"
            v-model="category"
            ref="categoryInput"
            type="text"
            name="category"
            id="category"
            placeholder="Category name"
            class="recipe-link-edit-form_category margin-top-md"
          />
        </div>
      </fieldset>
      <fieldset class="flex-column">
        <label for="labels">Labels (separate with comma)</label>
        <input
          v-model="labels"
          ref="labelsInput"
          type="text"
          name="labels"
          id="labels"
          placeholder="Dinner, quick, healthy"
          class="recipe-link-edit-form_labels"
        />
      </fieldset>
      <fieldset class="flex-column">
        <label for="comment">Comment</label>
        <textarea
          v-model="comment"
          ref="commentInput"
          type="comment"
          name="comment"
          id="comment"
          placeholder="Write a note to self about the recipe .."
          class="recipe-link-edit-form_comment"
        ></textarea>
      </fieldset>
      <fieldset>
        <div
          class="flex-row flex-row--align-center flex-row--space-between margin-v-lg"
        >
          <button
            class="button button--dynamic button--dynamic-small button--cancel margin-v-md"
            @click.prevent="emit('close-edit-mode')"
          >
            ✕ {{ $t("cancel") }}
          </button>
          <button
            type="submit"
            name="submit"
            class="button button-sm"
            @click.prevent="saveLink"
          >
            Save
          </button>
        </div>
        <ExpandTransition :show="!!submitError">
          <div class="system-message margin-top-sm">
            {{ submitError }}
          </div>
        </ExpandTransition>
      </fieldset>
    </form>
  </div>
</template>

<script setup>
import {
  getDatabase,
  ref as dbRef,
  update,
  push,
  child,
} from "firebase/database";

import SelectComponent from "~/components/Input/SelectComponent.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

import { useAuthStore, useRecipeStore } from "~/store";

const db = getDatabase();
const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const emit = defineEmits(["update", "close-edit-mode"]);

const props = defineProps({
  recipeLink: {
    type: Object,
    default: {},
  },
  addingToCategory: {
    type: String,
    default: null,
  },
});

const url = ref(props.recipeLink?.url || "");
const title = ref(props.recipeLink?.title || getDefaultTitle());
const category = ref("");
const labels = ref(props.recipeLink?.labels || "");
const comment = ref(props.recipeLink?.comment || "");
const errorMessage = ref("");
const submitError = ref("");
const newCategory = ref(false);
const selectedCategory = ref(
  props.recipeLink?.category || this.addingToCategory || ""
);

const categories = computed(() => {
  const linkCategories = [];

  recipeStore.userLinks?.forEach((link) => {
    if (link.category) {
      if (linkCategories.indexOf(link.category) === -1)
        linkCategories.push(link.category);
    }
  });
  return linkCategories;
});

function getDefaultTitle() {
  if (url.value) {
    let urlItems = url.value.split("/");

    urlItems = urlItems.filter((item) => {
      return item.length;
    });

    return urlItems.pop().replace(/-/g, " ");
  }
  return "No title";
}

function saveLink() {
  const urlCheck =
    /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
  console.info("[saveLink] URL test:", urlCheck.test(url.value));

  if (urlCheck.test(url.value)) {
    errorMessage.value = "";

    const dataObject = {
      url: url.value || "",
      title: title.value,
      category: category.value || selectedCategory.value || "",
      labels: labels.value,
      comment: comment.value,
    };

    const recipeLinksRef = dbRef(db, `users/${authStore.user.id}/recipeLinks`);

    if (props.recipeLink.id) {
      update(child(recipeLinksRef, props.recipeLink.id), dataObject)
        .then(() => {
          console.info("[saveLink] Successfully updated recipe link");
          emit("update");
        })
        .catch((error) => {
          submitError.value = error.message;
          console.error("[saveLink]", error.message);
        });
    } else {
      push(recipeLinksRef, dataObject)
        .then(() => {
          console.info("[saveLink] Successfully saved recipe link");
          emit("update");
        })
        .catch((error) => {
          submitError.value = error.message;
          console.error("[saveLink]", error.message);
        });
    }
  } else {
    console.error("[saveLink] Error in url:", url);
    errorMessage.value = "The URL is not the correct format.";
  }
}

function addNewCategory() {
  newCategory.value = true;
}

function handleSelect(option) {
  selectedCategory.value = option;
}
</script>
