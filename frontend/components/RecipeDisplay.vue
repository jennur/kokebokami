<template>
  <nuxt-link :to="'/recipes/' + recipeUrl" class="recipe-display">
    <h3 class="recipe-display__title">{{recipe.title ? recipe.title : "Recipe has no title"}}</h3>
    <p
      class="recipe-display__description"
    >{{recipe.description ? recipe.description : "Recipe has no description"}}</p>
    <p
      class="recipe-display__published-by"
      v-if="publicRecipe"
    >Published by: {{recipe.ownerName ? recipe.ownerName : "Unknown"}}</p>
  </nuxt-link>
</template>

<script>
export default {
  name: "recipe-display",
  props: {
    recipe: {
      type: Object,
      default: () => {}
    },
    recipeID: {
      type: String,
      default: ""
    },
    publicRecipe: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    recipeUrl() {
      return this.recipeID;
    }
  }
};
</script>
