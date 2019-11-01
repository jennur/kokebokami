<template>
  <div class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">{{headline}}</h3>
    <recipe-display
      v-for="recipe in recipes"
      :key="recipe[0]"
      :recipeID="recipe[0]"
      :recipe="recipe[1]"
    />
    <div v-if="!recipesLength">It looks like there's nothing here atm!</div>
  </div>
</template>

<script>
import RecipeDisplay from "./RecipeDisplay.vue";

export default {
  name: "recipes-list",
  components: {
    RecipeDisplay
  },
  props: {
    recipeID: {
      type: String,
      default: null
    },
    recipes: {
      type: Array,
      default: null
    },
    recipe: {
      type: Object,
      default: null
    },
    headline: {
      type: String,
      default: null
    }
  },
  computed: {
    recipesLength() {
      return this.recipes ? this.recipes.length : 0;
    }
  }
};
</script>
