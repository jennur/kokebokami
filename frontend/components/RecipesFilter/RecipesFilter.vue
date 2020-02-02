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
      console.log("Free from filter:", this.freeFrom);
      this.handleSearch();
    },
    handleSearch() {
      let recipes = this.recipes;
      let language = this.language;
      let categories = this.mealCategories;
      let typeOfMeal = this.typeOfMeal;
      let freeFrom = this.freeFrom;
      let searchTerm = this.searchTerm;
      let recipesToBeFiltered = recipes;

      // Filter on language
      if (
        recipesToBeFiltered &&
        language !== "" &&
        language !== "All languages"
      ) {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          if (recipe[1].language) {
            return recipe[1].language.toLowerCase() === language.toLowerCase();
          }
        });
      }
      // Filter on allergens
      if (recipesToBeFiltered && freeFrom.length) {
        freeFrom.forEach(allergen => {
          recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
            if (recipe[1].freeFrom) {
              return recipe[1].freeFrom.indexOf(allergen) > -1; //true: allergen in list
            }
          });
        });
      }

      // Filter on categories
      if (recipesToBeFiltered && categories.length) {
        categories.forEach(category => {
          recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
            if (recipe[1].categories) {
              return recipe[1].categories.indexOf(category) > -1; //true: category in list
            }
          });
        });
      }

      // Filter on type of meal
      if (recipesToBeFiltered && typeOfMeal.length) {
        console.log(
          "Recipes::",
          recipesToBeFiltered,
          "typeOfMeal::",
          typeOfMeal
        );
        typeOfMeal.forEach(type => {
          recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
            if (recipe[1].typeOfMeal) {
              return recipe[1].typeOfMeal.indexOf(type) > -1; //true: type in list
            }
          });
        });
      }

      // Filter on search term
      if (recipesToBeFiltered && searchTerm !== "") {
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
