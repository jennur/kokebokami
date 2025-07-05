<template>
  <section class="add-recipe-from-url padding-h-lg padding-v-xl">
    <h3 class="add-recipe-from-url_heading">Add new recipe from URL</h3>

    <form class="form mobile-width margin-auto">
      <fieldset class="flex-column">
        <label for="url">Recipe URL</label>
        <input
          v-model="url"
          ref="urlInput"
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com/recipe-url/"
          class="form_url"
        />
        <span class="form--required">*</span>
      </fieldset>

      <ExpandTransition :show="!!systemMessage">
        <div class="system-message">{{ systemMessage }}</div>
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
          class="form_title"
        />
      </fieldset>

      <fieldset class="flex-column">
        <label for="category">Category</label>
        <div class="flex-row flex-row--align-center">
          <SelectComponent
            ref="categorySelect"
            id="category-select"
            name="category-select"
            class="select--green margin-right-md"
            :options="categories"
            defaultValue="No category"
            @select="(option) => handleSelect(option)"
          />
          <button
            v-if="!newCategory"
            class="form_category-btn button button-xs button--green button--round"
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
            class="form_category"
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
          class="form_labels"
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
          class="form_comment"
        ></textarea>
      </fieldset>

      <fieldset class="container container--center margin-top-2xl">
        <button
          class="button button-sm button--cancel"
          @click.prevent="emit('cancel')"
        >
          ✕ {{ $t("cancel") }}
        </button>
        <button
          type="submit"
          name="submit"
          value="Save"
          class="button button-sm button--green margin-right-xl"
          @click.prevent="handleFormSubmit"
        >
          Save
        </button>
      </fieldset>
    </form>
  </section>
</template>

<script setup>
// TODO: Merge with RecipeLinkEditForm ?
import { getDatabase, ref as dbRef, push } from "firebase/database";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import { useAuthStore, useRecipeStore } from "~/store";

const db = getDatabase();
const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const emit = defineEmits(["save", "cancel"]);

const newCategory = ref(false);
const selectedCategory = ref("");
const systemMessage = ref("");
const url = ref("");
const title = ref(getDefaultTitle());
const category = ref("");
const labels = ref("");
const comment = ref("");

const categories = computed(() => {
  const linkCategories = [];

  recipeStore?.userLinks.forEach((link) => {
    if (link.category) {
      if (linkCategories.indexOf(link.category) === -1)
        linkCategories.push(link.category);
    }
  });
  return linkCategories;
});

function getDefaultTitle() {
  if (url.value) {
    const urlItems = url.value.split("/").filter((item) => {
      return item.length;
    });
    return urlItems.pop().replace(/-/g, " ");
  }
  return "";
}

function addNewCategory() {
  newCategory.value = true;
}

function handleSelect(option) {
  selectedCategory.value = option;
}

function handleFormSubmit() {
  const urlCheck =
    /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
  console.info("[handleFormSubmit] Valid url:", urlCheck.test(url.value));

  if (urlCheck.test(url.value)) {
    systemMessage.value = "";

    const dataObject = {
      url: url.value,
      title: title.value,
      category: category.value || selectedCategory.value || "",
      labels: labels.value,
      comment: comment.value,
    };

    push(dbRef(db, `users/${authStore.user.id}/recipeLinks`), dataObject)
      .then(() => {
        emit("save");
      })
      .catch((error) => {
        console.error("[handleFormSubmit]", error.message);
      });
  } else {
    console.error("[handleFormSubmit] Wrong URL format:", url);
    systemMessage.value = "The URL is not the correct format.";
  }
}
</script>
