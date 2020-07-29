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
          class="recipe-link-edit-form__url"
        />
        <span class="recipe-link-edit-form--required">*</span>
      </fieldset>
      <expand-transition :show="!!errorSystemMessage">
        <div class="system-message">{{ errorSystemMessage }}</div>
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
          class="recipe-link-edit-form__title"
        />
      </fieldset>
      <fieldset class="flex-column">
        <label for="category">Category</label>
        <div class="flex-row flex-row--align-center">
          <select-component
            ref="categorySelect"
            id="category-select"
            name="category-select"
            class="select--green margin-right--medium margin-top--medium"
            :options="categories"
            defaultValue="No category"
            :preSelected="selectedCategory"
            @select="option => handleSelect(option)"
          />
          <button
            v-if="!newCategory"
            class="recipe-link-edit-form__category-btn button button--xsmall button--green button--round margin-top--medium"
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
            class="recipe-link-edit-form__category margin-top--medium"
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
          class="recipe-link-edit-form__labels"
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
          class="recipe-link-edit-form__comment"
        />
      </fieldset>
      <fieldset>
        <div
          class="flex-row flex-row--align-center margin-vertical--large"
          :class="{
            'flex-row--space-between': recipeLinkID,
            'flex-row--justify-right': !recipeLinkID
          }"
        >
          <deleteIcon v-if="recipeLinkID" class="icon" @click="toggleAlert" />
          <button
            type="submit"
            name="submit"
            class="button button--small"
            @click.prevent="saveLink"
          >
            Save
          </button>
        </div>
        <expand-transition :show="!!submitSystemMessage">
          <div class="system-message margin-top--small">
            {{ submitSystemMessage }}
          </div>
        </expand-transition>
      </fieldset>
    </form>
    <Alert
      :alertMessage="`Are you sure you want to delete this link: '${title}'? `"
      :showAlert="showAlert"
      @confirmed="deleteLink"
      @cancel="toggleAlert"
    />
  </div>
</template>
<script>
import user from "~/mixins/user.js";
import userRecipeLinks from "~/mixins/userRecipeLinks.js";
import SelectComponent from "~/components/Input/SelectComponent.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";
import Alert from "~/components/Alert.vue";
import deleteIcon from "~/assets/graphics/icons/delete-icon.svg";

export default {
  name: "recipe-link-edit-form",
  components: {
    SelectComponent,
    ExpandTransition,
    Alert,
    deleteIcon
  },
  props: {
    recipeLink: {
      type: Object,
      default: {}
    },
    recipeLinkID: {
      type: String,
      default: ""
    },
    addingToCategory: {
      type: String,
      default: null
    }
  },
  data() {
    let recipeLink = this.recipeLink;
    return {
      url: (recipeLink && recipeLink.url) || "",
      title: (recipeLink && recipeLink.title) || "",
      category: "",
      labels: (recipeLink && recipeLink.labels) || "",
      comment: (recipeLink && recipeLink.comment) || "",
      errorSystemMessage: "",
      submitSystemMessage: "",
      newCategory: false,
      selectedCategory:
        (recipeLink && recipeLink.category) || this.addingToCategory || "",
      showAlert: false
    };
  },
  mixins: [user, userRecipeLinks],
  computed: {
    categories() {
      let links = this.userRecipeLinks;
      let categories = [];
      links.forEach(link => {
        if (link[1].category) {
          if (categories.indexOf(link[1].category) === -1)
            categories.push(link[1].category);
        }
      });
      return categories;
    }
  },
  methods: {
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    getDefaultTitle() {
      let url = this.url;
      if (url) {
        let urlItems = url.split("/");
        urlItems = urlItems.filter(item => {
          return item.length;
        });
        return urlItems.pop().replace(/-/g, " ");
      }
      return "No title";
    },
    deleteLink() {
      if (this.recipeLinkID) {
        const recipeLinkRef = this.$fireDb.ref(
          `users/${this.user.id}/recipeLinks/${this.recipeLinkID}`
        );
        recipeLinkRef
          .remove()
          .then(res => {
            this.showAlert = false;
            this.$emit("update");
          })
          .catch(error => {
            this.submitSystemMessage = error.message;
            console.log("Error deleting recipe:", error.message);
          });
      } else {
        this.showAlert = false;
      }
    },
    saveLink() {
      let url = this.url || "";
      let title = this.title || this.getDefaultTitle();
      let category = this.category || this.selectedCategory || "";
      let labels = this.labels || "";
      let comment = this.comment || "";

      let urlCheck = /(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\?#[\]@!$&'()*+,;=.]+/;
      console.log("URL Test:", urlCheck.test(url));

      if (urlCheck.test(url)) {
        this.errorSystemMessage = "";
        let dataObject = {
          url,
          title,
          category,
          labels,
          comment
        };

        try {
          if (this.recipeLinkID) {
            const recipeLinkRef = this.$fireDb.ref(
              `users/${this.user.id}/recipeLinks/${this.recipeLinkID}`
            );
            recipeLinkRef
              .update(dataObject)
              .then(() => {
                console.log("Successfully updated recipe link");
                this.$emit("update");
              })
              .catch(error => {
                this.submitSystemMessage = error.message;
                console.log("Error saving recipe", error.message);
              });
          } else {
            let userRef = this.$fireDb.ref(`users/${this.user.id}`);
            userRef
              .child("recipeLinks")
              .push(dataObject)
              .then(() => {
                console.log("Successfully saved recipe link");
                this.$emit("update");
              })
              .catch(error => {
                this.submitSystemMessage = error.message;
                console.log("Error saving recipe", error.message);
              });
          }
        } catch (error) {
          console.log("Error saving recipe link:", error.message);
        }
      } else {
        console.log("Error in url:", url);
        this.errorSystemMessage = "The URL is not the correct format.";
      }
    },
    addNewCategory() {
      this.newCategory = true;
    },
    handleSelect(option) {
      this.selectedCategory = option;
    }
  }
};
</script>
