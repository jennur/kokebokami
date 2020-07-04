<template>
  <div>
    <breadcrumbs class="margin-bottom--large" :routes="breadcrumbs" />
    <div class="tablet-width margin-top--xxlarge margin--auto">
      <expand-transition :show="recipeLoaded">
        <recipe-full-view
          :recipe="recipe"
          :recipeKey="recipeKey"
          :isRecipeOwner="isRecipeOwner"
          :recipeOwnerID="recipeOwner && recipeOwner[0]"
          @update="handleUpdate"
        />
      </expand-transition>
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import allRecipes from "~/mixins/allRecipes.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import RecipeFullView from "~/components/Recipes/RecipeFullView/RecipeFullView.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "recipe",
  components: { RecipeFullView, ExpandTransition },
  data() {
    return {
      isRecipeOwner: false,
      recipeOwnerUsername: null,
      recipeLoaded: false
    };
  },
  head() {
    return {
      title: `${this.recipe.title} | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com" + this.path
        }
      ]
    };
  },
  mixins: [user, allUsers, allRecipes, publicRecipes],
  computed: {
    path() {
      return this.$route.path;
    },
    recipeKey() {
      return this.$route.params.recipeid;
    },
    recipe() {
      if (this.user) {
        let allRecipes = this.allRecipes;
        let currentRecipe = allRecipes.filter(recipe => {
          return recipe[0] === this.recipeKey;
        });
        if (currentRecipe.length) {
          this.isRecipeOwner = currentRecipe[0][1].ownerID === this.user.id;
          this.recipeLoaded = true;
          return currentRecipe[0][1];
        }
      } else {
        console.log("Public recipes:", this.publicRecipes);
        let publicRecipes = this.publicRecipes;
        let currentRecipe = publicRecipes.filter(recipe => {
          return recipe[0] === this.recipeKey;
        });
      }
      return {};
    },
    recipeOwner() {
      let users = this.allUsers;
      return (
        users &&
        users.find(user => {
          return user[0] === this.recipe.ownerID;
        })
      );
    },
    breadcrumbs() {
      let recipeOwnerUsername = this.recipeOwner
        ? this.recipeOwner[1].displayName
        : "Unknown";

      if (this.recipe && !this.isRecipeOwner) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks/" },
          {
            name: recipeOwnerUsername,
            link: `/cooks/${this.recipe.ownerID}/`
          },
          { name: this.recipe.title }
        ];
      } else {
        return [
          { name: "Home", link: "/" },
          {
            name: "My cookbook",
            link: "/account/my-cookbook/"
          },
          { name: this.recipe.title }
        ];
      }
    }
  },
  methods: {
    handleUpdate() {
      this.getAllRecipes();
    }
  }
};
</script>
