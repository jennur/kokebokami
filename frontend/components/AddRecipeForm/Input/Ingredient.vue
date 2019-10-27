<template>
  <label>
    <input
      class="add-recipe-form__ingredient"
      type="text"
      placeholder="Amount of something"
      v-model="ingredient"
    />
  </label>
</template>
<script>
export default {
  name: "ingredient",
  data() {
    let ingredientValue = "";
    if (this.existingIngredient !== "") {
      ingredientValue = this.existingIngredient;
    }
    return { ingredient: ingredientValue };
  },
  props: {
    existingIngredient: {
      type: String,
      default: ""
    }
  }
};
</script>
