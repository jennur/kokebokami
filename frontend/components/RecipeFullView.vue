<template>
  <section class="mobile-width margin--auto">
    <div class="recipe">
      <h3 class="recipe__title">{{recipe.title ? recipe.title : "Recipe has no title"}}</h3>
      <div
        class="recipe__description"
      >{{recipe.description ? recipe.description : "Recipe has no description"}}</div>

      <h4 v-if="recipe.ingredients">Ingredients</h4>
      <ul class="recipe__ingredients" v-if="recipe.ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="ingredient">{{ingredient}}</li>
      </ul>
      <h4 v-if="recipe.instructions">Instructions</h4>

      <ol class="recipe__instructions">
        <li
          class="recipe__instructions-step"
          v-for="step in recipe.instructions"
          :key="step"
        >{{step ? step : "Recipe has no instructions"}}</li>
      </ol>
    </div>
  </section>
</template>

<script>
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";
export default {
  name: "recipe-full-view",
  components: {
    AddRecipeForm
  },
  computed: {
    recipeKey() {
      return this.$route.params.recipe;
    },
    recipe() {
      let recipes = this.$store.getters.recipes;
      let currentRecipe = recipes.filter(recipe => {
        return recipe[0] === this.recipeKey;
      });
      //console.log("RECIPE ::: " + currentRecipe[0][1]);
      return currentRecipe.length ? currentRecipe[0][1] : {};
    }
  }
};
</script>
