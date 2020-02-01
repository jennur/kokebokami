<template>
  <div class="categories">
    <h4 class="categories__title margin-bottom--medium">Categories</h4>
    <label
      class="categories__category margin-right--large"
      v-for="category in allMealCategories"
      :key="category"
    >
      <input
        type="checkbox"
        :value="category"
        :id="category"
        @change="
          event => {
            handleMealCategory(event.target);
          }
        "
      />
      {{ category }}
    </label>
  </div>
</template>
<script>
export default {
  name: "meal-categories",
  data() {
    return { mealCategories: [] };
  },
  computed: {
    allMealCategories() {
      let allCategoryObjects = this.$store.getters.allCategories;
      return Object.values(
        allCategoryObjects.filter(object => {
          return object.categories;
        })[0]
      )[0];
    }
  },
  methods: {
    handleMealCategory(target) {
      let categoryIndex = this.mealCategories.indexOf(target.value);
      let mealCategories = this.mealCategories;

      if (target.checked) {
        mealCategories.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        mealCategories.splice(categoryIndex, 1);
      }
      this.mealCategories = mealCategories;
      this.$emit("filter", this.mealCategories);
    }
  }
};
</script>
