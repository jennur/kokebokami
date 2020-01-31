<template>
  <div class="recipes-filter-container">
    <form class="recipes-filter__form" v-on:submit.prevent>
      <search-form :recipes="recipes" @filterSearchTerm="setSearchTerm" />
      <category-filter
        :categories="allCategories"
        @filterCategories="setCategories"
      />
    </form>
  </div>
</template>
<script>
import CategoryFilter from "./CategoryFilter.vue";
import SearchForm from "./SearchForm.vue";

export default {
  name: "recipes-filter",
  components: {
    CategoryFilter,
    SearchForm
  },
  data() {
    return { language: "", searchTerm: "", categories: [] };
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategories() {
      let allCategoryObjects = this.$store.getters.allCategories;
      let allCategories = [];
      allCategoryObjects.forEach(categoryObj => {
        allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });

      return allCategories;
    }
  },

  methods: {
    setSearchTerm(value) {
      this.searchTerm = value;
      this.handleSearch();
    },
    setCategories(categoryObject) {
      this.categories = categoryObject.categories;
      this.language = categoryObject.language;
      this.handleSearch();
    },
    handleSearch() {
      let publicRecipes = this.$store.getters.publicRecipes;
      let language = this.language;
      let categories = this.categories;
      let searchTerm = this.searchTerm;
      let filteredRecipes = [];
      let recipesToBeFiltered = publicRecipes;

      if (publicRecipes && language !== "" && language !== "All languages") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          return recipe[1].language === language;
        });
      }

      if (publicRecipes && categories.length) {
        categories.forEach(category => {
          let oneOrMoreRecipesOfCategory = -1;
          recipesToBeFiltered.forEach(recipe => {
            if (
              recipe[1].categories &&
              recipe[1].categories.indexOf(category) !== -1
            ) {
              oneOrMoreRecipesOfCategory *= 0;
              if (filteredRecipes && filteredRecipes.indexOf(recipe) === -1)
                filteredRecipes.push(recipe);
            }
          });
        });
        recipesToBeFiltered = filteredRecipes;
      }

      if (publicRecipes && searchTerm !== "") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          return (
            recipe[1].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe[1].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });
      }
      this.$emit("filter", recipesToBeFiltered);
    }
  }
};
</script>
