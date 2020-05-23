<template>
  <div class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">
      {{ headline }}
    </h3>
    <recipe-display
      v-for="recipe in recipes"
      :key="recipe[0]"
      :recipeID="recipe[0]"
      :recipe="recipe[1]"
      :publicRecipe="publicRecipe"
      :allUsers="allUsers"
    />
    <div v-if="!recipesLength">
      <p class="margin--none">
        It looks like there are no recipes here at the moment 😕
      </p>
    </div>
  </div>
</template>

<script>
import allUsers from "~/mixins/allUsers.js";
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
    headline: {
      type: String,
      default: null
    },
    publicRecipe: {
      type: Boolean,
      default: false
    }
  },
  mixins: [allUsers],
  computed: {
    recipesLength() {
      return this.recipes ? this.recipes.length : 0;
    }
  }
};
</script>
