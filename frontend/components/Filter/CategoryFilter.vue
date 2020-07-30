<template>
  <fieldset
    class="categories-container"
    :class="{ 'categories-container--transparent': transparent }"
  >
    <div class="categories-wrap">
      <language-input :existingLanguage="language" @update="handleLanguage" />
      <categories-input
        :existingCategories="categories"
        @update="handleMealCategory"
      />
      <type-of-meal-input
        :existingTypeOfMeal="typeOfMeal"
        @update="handleTypeOfMeal"
      />
      <free-from-input :existingFreeFrom="freeFrom" @update="handleFreeFrom" />
    </div>
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
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let existingCategories = this.existingCategories;
    return {
      categories: (existingCategories && existingCategories.categories) || [],
      typeOfMeal: (existingCategories && existingCategories.typeOfMeal) || [],
      language: (existingCategories && existingCategories.language) || "",
      freeFrom: (existingCategories && existingCategories.freeFrom) || [],
      filteredCategories: []
    };
  },
  computed: {
    allCategoryObjects() {
      return this.$store.state.allCategories;
    },
    allCategories() {
      let allCategories = [];
      console.log("Object vals:", Object.values(this.allCategoryObjects));
      Object.values(this.allCategoryObjects).forEach(categoryObj => {
        allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });

      //return allCategories;
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
