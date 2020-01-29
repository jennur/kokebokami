<template>
  <form class="search-form" v-on:submit.prevent>
    <search-form :recipes="recipes" @filterSearchTerm="setSearchTerm" />
    <category-filter :categories="allCategories" @filterCategories="setCategory" />
    <button @click="handleSearch">Apply</button>
  </form>
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
    return { searchTerm: "", categories: [] };
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
    },
    setCategory(target) {
      let categoryIndex = this.categories.indexOf(target.value);

      if (target.checked) {
        this.categories.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        this.categories.splice(categoryIndex, 1);
      }
    },
    handleSearch() {
      let publicRecipes = this.$store.getters.publicRecipes;
      let categories = this.categories;
      let searchTerm = this.searchTerm;
      let filteredRecipes = [];
      let recipesToBeFiltered = publicRecipes;
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
      console.log("Recipes To Be Filtered:::", recipesToBeFiltered);
      this.$emit("filter", recipesToBeFiltered);
    }
  }
};
</script>
