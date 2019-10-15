<template>
  <div class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">{{headline}}</h3>
    <recipe-display
      v-for="recipe in recipes"
      :key="recipe[0]"
      :recipeID="recipe[0]"
      :recipe="recipe[1]"
    />
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
    recipe: {
      type: Array,
      default: null
    },
    headline: {
      type: String,
      default: null
    }
  },
  computed: {
    recipes() {
      return this.$store.getters.recipes;
    }
  }
};
</script>
