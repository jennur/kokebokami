<template>
  <div>
    <div
      v-if="!editMode && !loading"
      class="recipe_categories margin-top-lg"
    >
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
          @click="event => toggleEditMode(event)"
        />
      </span>

      <button
        v-if="!categories.length"
        class="button button-xs button--round"
        @click="event => toggleEditMode(event)"
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
<script>
import CategoryEdit from "./Editing/CategoryEdit.vue";
import ClickOutside from "vue-click-outside";
export default {
  name: "category-display",
  components: {
    CategoryEdit
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    },
    recipeKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editMode: false,
      loading: false,
      beforeEdit: null
    };
  },
  computed: {
    allCategories() {
      return this.$store.state.allCategories.categories;
    },
    categoryNames() {
      let allCategories = this.$store.state.allCategories.categories;
      let localeCategories = this.$t("recipes.allCategories.categories");
      return (
        this.categories &&
        this.categories.map(category => {
          let index = allCategories.indexOf(category);
          return localeCategories[index];
        })
      );
    }
  },
  methods: {
    toggleEditClass(index) {
      if (index === this.beforeEdit) index = null;
      this.beforeEdit = index;
    },
    toggleEditMode(event) {
      event && event.stopPropagation();
      this.editMode = !this.editMode;
    },
    saveCategories(categories) {
      this.editMode = false;
      let recipeKey = this.recipeKey;

      if (recipeKey) {
        this.loading = true;
        this.$fire.database
          .ref(`recipes/${recipeKey}/categories`)
          .set(categories)
          .then(() => {
            console.log("Successfully updated categories");
            this.loading = false;
            this.$emit("update");
          })
          .catch(error =>
            console.log("Error setting categories:", error.message)
          );
      } else {
        this.$emit("update", { categories });
      }
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
