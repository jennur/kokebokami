<template>
  <div class="container container--center tablet-width">
    <nuxt-link class="margin--large" to="/account/manage-account">Manage my account</nuxt-link>

    <h2 class="heading--display-font margin-bottom--large">{{this.firstName}}'s kokebok</h2>
    <nuxt-link
      to="/add-recipe"
      class="button button--large button--round margin--auto margin-top--medium"
    >Add new recipe</nuxt-link>
    <recipes-list class="padding--large" :headline="headline" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "account",
  data() {
    return { addingRecipe: false, addRecipeButtonText: "Add new recipe" };
  },
  components: { RecipesList },
  mixins: [user],
  computed: {
    firstName() {
      return this.user ? this.user.name.split(" ")[0] : null;
    },
    headline() {
      const numRecipes = this.$store.getters.recipes.length;
      return numRecipes ? null : "It seems like your cook book is empty!";
    }
  },
  methods: {
    /*toggleRecipeAdder() {
      this.addingRecipe = !this.addingRecipe;
      this.addRecipeButtonText = this.addingRecipe
        ? "✕ Cancel"
        : "Add new Recipe";
    }*/
  }
};
</script>

