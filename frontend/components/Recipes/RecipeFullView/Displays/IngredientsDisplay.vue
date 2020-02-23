<template>
  <div>
    <h4>Ingredients</h4>
    <ul class="recipe__ingredients">
      <li v-for="(ingredient, index) in ingredients" :key="`ingredient-${index}`">{{ ingredient }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ingredients-display",
  props: {
    ingredients: {
      type: Array,
      default: () => []
    }
  }
};
</script>
