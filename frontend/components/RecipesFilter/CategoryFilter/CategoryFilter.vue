<template>
  <fieldset id="categories" class="categories-container">
    <language @filter="handleLanguage" />
    <meal-categories @filter="handleMealCategory" />
    <type-of-meal @filter="handleTypeOfMeal" />
    <free-from @filter="handleFreeFrom" />
  </fieldset>
</template>
<script>
import Language from "./Categories/Language.vue";
import TypeOfMeal from "./Categories/TypeOfMeal.vue";
import MealCategories from "./Categories/MealCategories.vue";
import FreeFrom from "./Categories/FreeFrom.vue";

export default {
  name: "category-filter",
  components: {
    Language,
    TypeOfMeal,
    MealCategories,
    FreeFrom
  },
  data() {
    return { filteredCategories: [] };
  },
  computed: {
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    allCategories() {
      let allCategories = [];
      this.allCategoryObjects.forEach(categoryObj => {
        allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });

      return allCategories;
    }
  },
  methods: {
    handleLanguage(language) {
      this.$emit("setLanguage", language);
    },
    handleTypeOfMeal(category) {
      this.$emit("setTypeOfMeal", category);
    },
    handleMealCategory(category) {
      this.$emit("setMealCategories", category);
    },
    handleFreeFrom(category) {
      this.$emit("setFreeFrom", category);
    }
  }
};
</script>
