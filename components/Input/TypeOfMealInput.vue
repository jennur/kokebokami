<template>
  <fieldset id="typeOfMeal" class="categories">
    <h4 class="categories_title margin-bottom-md">Type of meal</h4>
    <label
      class="categories_category margin-right-lg"
      v-for="typeOfMeal in allTypesOfMeal"
      :key="typeOfMeal"
    >
      <input
        type="checkbox"
        :value="typeOfMeal"
        :id="typeOfMeal"
        @change="
          event => {
            handleTypeOfMeal(event.target);
          }
        "
      />
      {{ typeOfMeal }}
    </label>
  </fieldset>
</template>
<script>
export default {
  name: "type-of-meal-input",
  data() {
    return { typeOfMeal: [] };
  },
  props: {
    existingTypeOfMeal: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    allTypesOfMeal() {
      let allCategoryObjects = this.$store.state.allCategories;
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
      this.$emit("update", this.typeOfMeal);
    }
  },
  mounted() {
    let existingTypeOfMeal = this.existingTypeOfMeal;
    if (existingTypeOfMeal && existingTypeOfMeal.length) {
      existingTypeOfMeal.forEach(type => {
        let element = document.getElementById(type);
        if (element) element.checked = true;
      });
      this.checkedTypeOfMeal = this.existingTypeOfMeal;
    }
  }
};
</script>
