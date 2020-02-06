<template>
  <div class="recipe__categories margin-top--large">
    <span
      class="recipe__category margin-right--large"
      v-for="category in mealCategories"
      :key="category"
    >{{ category }}</span>
  </div>
</template>
<script>
export default {
  name: "category-display",
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    allTypesOfMeal() {
      // Needed due to duplicate in previous categories
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    },
    mealCategories() {
      let categories = [];
      if (this.categories) {
        this.categories.forEach(category => {
          if (this.allTypesOfMeal.indexOf(category) === -1) {
            // ^ Needed due to duplicate of typeOfMeal in previous categories
            categories.push(category);
          }
        });
      }
      return categories;
    }
  }
};
</script>
