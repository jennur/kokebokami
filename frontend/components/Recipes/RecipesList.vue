<template>
  <section class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">{{ headline }}</h3>
    <recipe-display
      v-for="recipe in recipes"
      :key="recipe[0]"
      :recipeID="recipe[0]"
      :recipe="recipe[1]"
      :inPublicList="isPublicList"
      :allUsers="allUsers"
    />
    <div v-if="!recipesLength" class="container container--center">
      <p class="margin--auto margin-bottom--medium mobile-width">{{ emptyListMessage }}</p>
      <nuxt-link v-if="addRecipeUrl" :to="addRecipeUrl">➔ Add a recipe 👨‍🍳</nuxt-link>
    </div>
  </section>
</template>

<script>
import RecipeDisplay from "./RecipeDisplay.vue";
import allUsers from "~/mixins/allUsers.js";
export default {
  name: "recipes-list",
  components: {
    RecipeDisplay,
  },
  props: {
    recipeID: {
      type: String,
      default: null,
    },
    recipes: {
      type: Array,
      default: null,
    },
    headline: {
      type: String,
      default: null,
    },
    isPublicList: {
      type: Boolean,
      default: false,
    },
    emptyListMessage: {
      type: String,
      default: "Looks like there is nothing here at the moment 😕",
    },
    addRecipeUrl: {
      type: String,
      default: "",
    },
  },
  mixins: [allUsers],
  computed: {
    recipesLength() {
      return this.recipes ? this.recipes.length : 0;
    },
  },
};
</script>
