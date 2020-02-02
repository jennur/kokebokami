<template>
  <fieldset id="categories" class="categories-container">
    <language-input @update="handleLanguage" />
    <categories-input @update="handleMealCategory" />
    <type-of-meal-input @update="handleTypeOfMeal" />
    <free-from-input @update="handleFreeFrom" />
  </fieldset>
</template>
<script>
import LanguageInput from "~/components/Input/LanguageInput.vue";
import TypeOfMealInput from "~/components/Input/TypeOfMealInput.vue";
import CategoriesInput from "~/components/Input/CategoriesInput.vue";
import FreeFromInput from "~/components/Input/FreeFromInput.vue";

export default {
  name: "category-filter",
  components: {
    LanguageInput,
    TypeOfMealInput,
    CategoriesInput,
    FreeFromInput
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
