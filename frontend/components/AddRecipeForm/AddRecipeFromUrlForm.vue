<template>
  <section
    class="add-recipe-from-url padding-horizontal--large padding-vertical--xlarge"
  >
    <h3 class="add-recipe-from-url__heading">Add new recipe from URL</h3>
    <form class="form mobile-width margin--auto">
      <fieldset class="flex-column">
        <label for="url">Recipe URL</label>
        <input
          v-model="url"
          ref="urlInput"
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com/recipe-url/"
          class="form__url"
        />
        <span class="form--required">*</span>
      </fieldset>
      <expand-transition :show="!!systemMessage">
        <div class="system-message">{{ systemMessage }}</div>
      </expand-transition>
      <fieldset class="flex-column">
        <label for="title">Title</label>
        <input
          v-model="title"
          ref="titleInput"
          type="text"
          name="title"
          id="title"
          placeholder="My custom title"
          class="form__title"
        />
      </fieldset>
      <fieldset class="flex-column">
        <label for="category">Category</label>
        <div class="flex-row flex-row--align-center">
          <select-component
            ref="categorySelect"
            id="category-select"
            name="category-select"
            class="select--green margin-right--medium"
            :options="categories"
            defaultValue="No category"
            @select="option => handleSelect(option)"
          />
          <button
            v-if="!newCategory"
            class="form__category-btn button button--xsmall button--green button--round"
            @click.prevent="addNewCategory"
          >
            New category
          </button>
          <input
            v-if="newCategory"
            v-model="category"
            ref="category"
            type="text"
            name="category"
            id="category"
            placeholder="Category name"
            class="form__category"
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
          class="form__labels"
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
          class="form__comment"
        />
      </fieldset>
      <fieldset class="container container--center margin-top--xxlarge">
        <button
          class="button button-sm button--cancel"
          @click.prevent="$emit('cancel')"
        >
          ✕ {{ $t("cancel") }}
        </button>
        <button
          type="submit"
          name="submit"
          value="Save"
          class="button button-sm button--green margin-right--xlarge"
          @click.prevent="handleFormSubmit"
        >
          Save
        </button>
      </fieldset>
    </form>
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import recipeLinks from "~/mixins/user-recipe-links.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import SelectComponent from "~/components/Input/SelectComponent.vue";
export default {
  name: "add-recipe-from-url-form",
  components: {
    ExpandTransition,
    SelectComponent
  },
  data() {
    let regex = /-/gi;
    let title = this.getDefaultTitle();
    return {
      newCategory: false,
      selectedCategory: "",
      systemMessage: "",
      url: "",
      title,
      category: "",
      labels: "",
      comment: ""
    };
  },
  mixins: [user, recipeLinks],
  computed: {
    categories() {
      let links = this.recipeLinks;
      let categories = [];
      links && links.forEach(link => {
        if (link.category) {
          if (categories.indexOf(link.category) === -1)
            categories.push(link.category);
        }
      });
      return categories;
    }
  },
  methods: {
    getDefaultTitle() {
      let url = this.url;
      if (url) {
        let urlItems = url
          .split("/")
          .filter(item => {
          return item.length;
        });
        return urlItems.pop().replace(/-/g, " ");
      }
      return "";
    },
    addNewCategory() {
      this.newCategory = true;
    },
    handleSelect(option) {
      this.selectedCategory = option;
    },
    handleFormSubmit() {
      let url = this.url || "";
      let title = this.title || this.getDefaultTitle();
      let category = this.category || this.selectedCategory || "";
      let labels = this.labels || "";
      let comment = this.comment || "";

      let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
      console.log("Valid url:", urlCheck.test(url));

      if (urlCheck.test(url)) {
        this.systemMessage = "";
        let dataObject = {
          url,
          title,
          category,
          labels,
          comment
        };
        try {
          this.$fire.database.ref(`users/${this.user.id}/recipeLinks`).push(dataObject);
          this.$emit("save");
        } catch (error) {
          console.log("Error saving recipe link:", error.message);
        }
      } else {
        console.log("Url wrong format:", url);
        this.systemMessage = "The URL is not the correct format.";
      }
    }
  }
};
</script>
