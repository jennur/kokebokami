<template>
  <div class="container">
    <recipe-component :recipe="recipe" />
  </div>
</template>

<script>
import Recipe from "~/components/RecipeComponent.vue";

export default {
  name: "recipe",
  components: { RecipeComponent },
  props: {
    recipe: {
      type: Object,
      default: {}
    }
  }
};
</script>

