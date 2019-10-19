<template>
  <div class="container">
    <h2>Here's kokeboka di, {{this.firstName}}!</h2>
    <button
      @click="toggleRecipeAdder"
      :class="'button button--large button--round margin--auto ' + (addingRecipe ? 'button--cancel' : '')"
    >{{ addRecipeButtonText}}</button>
    <add-recipe v-if="addingRecipe" :addingRecipe="addingRecipe" @toggle="toggleRecipeAdder" />
    <recipes-list class="padding--large" :headline="headline" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import AddRecipe from "~/components/AddRecipe.vue";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "account",
  data() {
    return { addingRecipe: false, addRecipeButtonText: "Add new recipe" };
  },
  components: { AddRecipe, RecipesList },
  mixins: [user],
  computed: {
    firstName() {
      return this.user ? this.user.name.split(" ")[0] : null;
    },
    headline() {
      const numRecipes = this.$store.getters.recipes.length;
      return numRecipes
        ? "Here are your recipes"
        : "You have no recipes at the moment";
    }
  },
  methods: {
    toggleRecipeAdder() {
      this.addingRecipe = !this.addingRecipe;
      this.addRecipeButtonText = this.addingRecipe
        ? "✕ Cancel"
        : "Add new Recipe";
    }
  }
};
</script>

