<template>
  <div class="container">
    <add-recipe-form :recipe="recipe" />
  </div>
</template>

<script>
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";

export default {
  name: "recipe",
  components: { AddRecipeForm },
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

