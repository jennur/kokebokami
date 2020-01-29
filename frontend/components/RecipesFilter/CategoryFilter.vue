<template>
  <fieldset id="categories">
    <h4 class="margin-bottom--medium">Categories</h4>

    <label
      class="search-form__category margin-right--large"
      v-for="category in categories"
      :key="category"
      :id="category"
    >
      <input type="checkbox" :value="category" @change="(event) =>{handleCategory(event.target)}" />
      {{category}}
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "category-filter",
  props: {
    categories: {
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
    },
    typeOfMeal() {
      return Object.values(
        this.allCategories.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    },
    languages() {
      return Object.values(
        this.allCategories.filter(object => {
          return object.languages;
        })[0]
      )[0];
    },
    mealCategories() {
      return Object.values(
        this.allCategories.filter(object => {
          return object.categories;
        })[0]
      )[0];
    },
    freeFrom() {
      return Object.values(
        this.allCategories.filter(object => {
          return object.freeFrom;
        })[0]
      )[0];
    }
  },
  methods: {
    handleCategory(target) {
      this.$emit("filterCategories", target);
    }
  }
};
</script>
