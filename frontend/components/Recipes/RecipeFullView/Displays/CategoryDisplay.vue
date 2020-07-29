<template>
  <div>
    <div
      v-if="!editMode && !loading"
      class="recipe__categories margin-top--large"
    >
      <span
        class="recipe__category margin-right--large"
        :class="{ editable: isRecipeOwner }"
        v-for="(category, index) in categories"
        :key="`category-${index}`"
        >{{ category }}
        <edit-icon
          class="icon recipe__category-edit-icon"
          @click="event => toggleEditMode(event)"
      /></span>
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
      loading: false
    };
  },
  computed: {
    allCategories() {
      return this.$store.state.allCategories.categories;
    }
  },
  methods: {
    toggleEditMode(event) {
      event && event.stopPropagation();
      this.editMode = !this.editMode;
    },
    saveCategories(categories) {
      this.editMode = false;
      this.loading = true;
      let categoriesRef = this.$fireDb.ref(
        `recipes/${this.recipeKey}/categories`
      );
      categoriesRef
        .set(categories)
        .then(() => {
          console.log("Successfully updated categories");
          this.loading = false;
          this.$emit("update");
        })
        .catch(error =>
          console.log("Error setting categories:", error.message)
        );
    }
  }
};
</script>
