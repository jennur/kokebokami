<template>
  <fieldset id="categories" class="categories">
    <h4 class="categories_title margin-bottom-md">Categories</h4>

    <label
      class="categories_category margin-right-lg"
      v-for="category in categories"
      :key="category"
    >
      <input
        tabindex="0"
        type="checkbox"
        :id="category"
        :value="category"
        @change="event => handleCategory(event.target)"
      />
      {{ category }}
    </label>
  </fieldset>
</template>
<script>
//Categories, FreeFrom, TypeOfMeal can be merged to one component
export default {
  name: "categories-input",
  data() {
    return { checkedCategories: [] };
  },
  props: {
    existingCategories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allCategoryObjects() {
      return this.$store.allCategories;
    },
    categories() {
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.categories;
        })[0]
      )[0];
    },
    allTypesOfMeal() {
      // Needed due to duplicate in previous categories
      return Object.values(
        this.allCategoryObjects.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    }
  },
  methods: {
    handleCategory(target) {
      let checkedCategories = [].concat(this.checkedCategories);
      let categoryIndex = checkedCategories.indexOf(target.value);
      if (target.checked) {
        checkedCategories.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        checkedCategories.splice(categoryIndex, 1);
      }

      this.checkedCategories = checkedCategories;

      this.$emit("update", this.checkedCategories);
    }
  },
  mounted() {
    let existingCategories = this.existingCategories;
    if (existingCategories && existingCategories.length) {
      existingCategories.forEach(category => {
        if (this.allTypesOfMeal.indexOf(category) === -1) {
          // ^ Needed due to duplicate of typeOfMeal in previous categories
          let element = document.getElementById(category);
          if (element) element.checked = true;
        }
      });
      this.checkedCategories = this.existingCategories;
    }
  }
};
</script>
