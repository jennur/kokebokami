<template>
  <div class="recipe-display">
    <h3 class="recipe-display__title">{{recipe.title}}</h3>
    <p class="recipe-display__description">{{recipe.description}}</p>
  </div>
</template>

<script>
export default {
  name: "recipe-display",
  props: {
    recipe: {
      type: Object,
      default: {}
    }
  }
};
</script>
