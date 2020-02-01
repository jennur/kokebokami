<template>
  <div class="recipes-filter-container">
    <form class="recipes-filter__form" v-on:submit.prevent>
      <search-form :recipes="recipes" @filterSearchTerm="setSearchTerm" />
      <category-filter
        @setLanguage="setLanguage"
        @setTypeOfMeal="setTypeOfMeal"
        @setMealCategories="setMealCategories"
        @setFreeFrom="setFreeFrom"
      />
    </form>
  </div>
</template>
<script>
import CategoryFilter from "./CategoryFilter/CategoryFilter.vue";
import SearchForm from "./SearchForm.vue";

export default {
  name: "recipes-filter",
  components: {
    CategoryFilter,
    SearchForm
  },
  data() {
    return {
      language: "",
      searchTerm: "",
      typeOfMeal: [],
      mealCategories: [],
      freeFrom: [],
      categories: []
    };
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    setSearchTerm(value) {
      this.searchTerm = value;
      this.handleSearch();
    },
    setLanguage(language) {
      this.language = language;
      this.handleSearch();
    },
    setTypeOfMeal(typeOfMeal) {
      this.typeOfMeal = typeOfMeal;
      this.handleSearch();
    },
    setMealCategories(mealCategories) {
      this.mealCategories = mealCategories;
      this.handleSearch();
    },
    setFreeFrom(freeFrom) {
      this.freeFrom = freeFrom;
      this.handleSearch();
    },
    handleSearch() {
      let recipes = this.recipes;
      let language = this.language;
      let categories = this.typeOfMeal.concat(this.mealCategories);
      let freeFrom = this.freeFrom;
      let searchTerm = this.searchTerm;
      let filteredRecipes = [];
      let recipesToBeFiltered = recipes;

      if (recipes && language !== "" && language !== "All languages") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          if (recipe[1].language) {
            return recipe[1].language.toLowerCase() === language.toLowerCase();
          }
        });
      }

      if (recipes && freeFrom.length) {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          if (recipe.freeFrom) {
            return freeFrom.forEach(allergen => {
              return recipe.freeFrom.indexOf(allergen) > -1; //true: allergen in list
            });
          }
        });
      }

      if (recipes && categories.length) {
        categories.forEach(category => {
          let oneOrMoreRecipesOfCategory = -1;
          recipesToBeFiltered.forEach(recipe => {
            let recipeTypeOfMeal = recipe[1].typeOfMeal
              ? recipe[1].typeOfMeal
              : [];
            let recipeMealCategories = recipe[1].categories
              ? recipe[1].categories
              : [];

            let recipeCategories = recipeTypeOfMeal.concat(
              recipeMealCategories
            );

            if (recipeCategories && recipeCategories.indexOf(category) !== -1) {
              oneOrMoreRecipesOfCategory *= 0;
              if (filteredRecipes && filteredRecipes.indexOf(recipe) === -1)
                filteredRecipes.push(recipe);
            }
          });
        });
        recipesToBeFiltered = filteredRecipes;
      }

      if (recipes && searchTerm !== "") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          return (
            recipe[1].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe[1].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });
      }
      this.$emit("filter", {
        recipes: recipesToBeFiltered,
        filtered: true
      });
    }
  }
};
</script>
