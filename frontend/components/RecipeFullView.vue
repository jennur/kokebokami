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

      <div class="recipe__instructions">
        <ol>
          <li
            v-for="step in recipe.instructions"
            :key="step"
          >{{step ? step : "Recipe has no instructions"}}</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "recipe-full-view",
  computed: {
    recipe() {
      let recipeID = this.$route.params.recipe;
      let recipes = this.$store.getters.recipes;
      let currentRecipe = recipes.filter(recipe => {
        return recipe[0] === recipeID;
      });
      //console.log("RECIPE ::: " + currentRecipe[0][1]);
      return currentRecipe.length ? currentRecipe[0][1] : {};
    }
  }
};
</script>
