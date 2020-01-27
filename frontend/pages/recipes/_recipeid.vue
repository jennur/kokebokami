<template>
  <div>
    <breadcrumbs class="margin-bottom--large" :routes="breadcrumbs" />
    <div class="mobile-width margin-top--xxlarge margin--auto">
      <recipe-full-view :recipe="recipe" :recipeKey="recipeKey" :isRecipeOwner="isRecipeOwner" />
    </div>
  </div>
</template>

<script>
import RecipeFullView from "~/components/Recipes/RecipeFullView.vue";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "recipe",
  components: { RecipeFullView },
  data() {
    return {
      isRecipeOwner: false,
      recipeOwnerUsername: null
    };
  },
  mixins: [user],
  computed: {
    recipeKey() {
      return this.$route.params.recipeid;
    },
    recipe() {
      let userRecipes = this.$store.getters.recipes;
      let sharedRecipes = this.$store.getters.sharedRecipes;
      let publicRecipes = this.$store.getters.publicRecipes;
      let allAvailableRecipes = userRecipes
        .concat(sharedRecipes)
        .concat(publicRecipes);

      let currentRecipe = allAvailableRecipes.filter(recipe => {
        let recipeCheck = recipe[0] === this.recipeKey;
        if (recipeCheck) {
          this.recipeOwnerID = recipe[1].ownerID;
          this.isRecipeOwner = recipe[1].ownerID === this.user.id;
        }
        return recipeCheck;
      });
      return currentRecipe.length ? currentRecipe[0][1] : {};
    },
    recipeOwner() {
      let users = this.$store.getters.allUsers;
      if (users) {
        return users.find(user => {
          return user[0] === this.recipe.ownerID;
        });
      }
    },
    breadcrumbs() {
      let recipeOwnerUsername = this.recipeOwner
        ? this.recipeOwner[1].displayName
        : "Unknown";

      if (this.recipe && !this.isRecipeOwner) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks" },
          {
            name: recipeOwnerUsername,
            link: `/cooks/${this.recipe.ownerID}`
          },
          { name: this.recipe.title }
        ];
      } else {
        return [
          { name: "Home", link: "/" },
          {
            name: "My recipes",
            link: "/my-recipes"
          },
          { name: this.recipe.title }
        ];
      }
    }
  }
};
</script>

