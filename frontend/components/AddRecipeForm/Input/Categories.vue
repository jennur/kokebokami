<template>
  <fieldset>
    <h4 class="margin-bottom--medium">Categories</h4>

    <label
      class="search-form__category margin-right--large"
      v-for="category in categories"
      :key="category"
    >
      <input type="checkbox" :id="category" :value="category" />
      {{category}}
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "categories",

  props: {
    existingCategories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategoryObjects() {
      return this.$store.getters.allCategories;
    },
    categories() {
      let allCategories = [];
      this.allCategoryObjects.forEach(categoryObj => {
        allCategories = allCategories.concat(Object.values(categoryObj)[0]);
      });

      return allCategories;
    }
  },
  mounted() {
    let existingCategories = this.existingCategories;
    if (existingCategories.length) {
      existingCategories.forEach(category => {
        document.getElementById(category).checked = true;
      });
    }
  }
};
</script>
