<template>
  <div class="container">
    <h2>Welcome back, {{this.firstName}}!</h2>
    <button @click="toggleRecipeAdder" class="button margin--auto">Add new recipe</button>
    <add-recipe v-if="addingRecipe" />
    <recipes-list class="padding--large" headline="Here are your recipes" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import AddRecipe from "~/components/AddRecipe.vue";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "account",
  data() {
    return { addingRecipe: false };
  },
  components: { AddRecipe, RecipesList },
  mixins: [user],
  computed: {
    firstName() {
      return this.user ? this.user.name.split(" ")[0] : null;
    }
  },
  methods: {
    toggleRecipeAdder() {
      this.addingRecipe = !this.addingRecipe;
    }
  }
};
</script>

