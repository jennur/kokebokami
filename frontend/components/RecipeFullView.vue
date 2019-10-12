<template>
  <div class="recipe">
    <h3 class="recipe__title">{{recipe.title}}</h3>
    <ul class="recipe__ingredients">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient">{{ingredient}}</li>
    </ul>
    <div class="recipe__description">{{recipe.description}}</div>
    <div class="recipe__instructions">{{recipe.instructions}}</div>
  </div>
</template>

<script>
export default {
  name: "recipe-full-view",
  props: {
    recipe: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
