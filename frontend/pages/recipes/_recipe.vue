<template>
  <div class="container">
    <recipe-full-view :recipe="recipe" />
  </div>
</template>

<script>
import RecipeFullView from "~/components/RecipeFullView.vue";

export default {
  name: "recipe",
  components: { RecipeFullView },
  props: {},
  computed: {
    recipe() {
      let recipes = this.$store.getters.recipes;
      return recipes.find(recipe => {
        return recipe.id === this.$route.params.recipe;
      });
    }
  }
};
</script>

