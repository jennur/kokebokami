<template>
  <fieldset class="categories-container">
    <language-input :existingLanguage="language" @update="handleLanguage" />
    <categories-input :existingCategories="categories" @update="handleMealCategory" />
    <type-of-meal-input :existingTypeOfMeal="typeOfMeal" @update="handleTypeOfMeal" />
    <free-from-input :existingFreeFrom="freeFrom" @update="handleFreeFrom" />
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
  props: {
    existingCategories: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      categories: [],
      typeOfMeal: [],
      language: "",
      freeFrom: [],
      filteredCategories: []
    };
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
  },
  created() {
    if (this.existingCategories) {
      this.categories = this.existingCategories.categories;
      this.language = this.existingCategories.language;
      this.freeFrom = this.existingCategories.freeFrom;
      this.typeOfMeal = this.existingCategories.typeOfMeal;
    }
  }
};
</script>
