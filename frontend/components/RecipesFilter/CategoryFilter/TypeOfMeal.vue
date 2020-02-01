<template>
  <div class="categories">
    <h4 class="categories__title margin-bottom--medium">Type of meal</h4>
    <label
      class="categories__category margin-right--large"
      v-for="category in allTypesOfMeal"
      :key="category"
    >
      <input
        type="checkbox"
        :value="category"
        :id="category"
        @change="
          event => {
            handleTypeOfMeal(event.target);
          }
        "
      />
      {{ category }}
    </label>
  </div>
</template>
<script>
export default {
  name: "type-of-meal",
  data() {
    return { typeOfMeal: [] };
  },
  computed: {
    allTypesOfMeal() {
      let allCategoryObjects = this.$store.getters.allCategories;
      return Object.values(
        allCategoryObjects.filter(object => {
          return object.typeOfMeal;
        })[0]
      )[0];
    }
  },
  methods: {
    handleTypeOfMeal(target) {
      let categoryIndex = this.typeOfMeal.indexOf(target.value);
      let typeOfMeal = this.typeOfMeal;

      if (target.checked) {
        typeOfMeal.push(target.value);
      } else if (!target.checked && categoryIndex !== -1) {
        typeOfMeal.splice(categoryIndex, 1);
      }
      this.typeOfMeal = typeOfMeal;
      this.$emit("filter", this.typeOfMeal);
    }
  }
};
</script>
