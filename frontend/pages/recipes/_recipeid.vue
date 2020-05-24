<template>
  <div>
    <breadcrumbs class="margin-bottom--large" :routes="breadcrumbs" />
    <div class="tablet-width margin-top--xxlarge margin--auto">
      <expand-transition :show="recipeLoaded">
        <recipe-full-view
          :recipe="recipe"
          :recipeKey="recipeKey"
          :isRecipeOwner="isRecipeOwner"
          @update="handleUpdate"
        />

        <comments
          class="mobile-width margin--auto margin-top--xlarge"
          :path="path"
        />
      </expand-transition>
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import allRecipes from "~/mixins/allRecipes.js";

import RecipeFullView from "~/components/Recipes/RecipeFullView/RecipeFullView.vue";
import Comments from "~/components/Comments/Comments.vue";
import ExpandTransition from "~/components/Transitions/Expand.vue";

export default {
  name: "recipe",
  components: { RecipeFullView, Comments, ExpandTransition },
  data() {
    return {
      isRecipeOwner: false,
      recipeOwnerUsername: null,
      recipeLoaded: false
    };
  },
  head() {
    return {
      title: `Kokebokami | ${this.recipe.title}`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com" + this.path
        }
      ]
    };
  },
  mixins: [user, allUsers, allRecipes],
  computed: {
    path() {
      return this.$route.path;
    },
    recipeKey() {
      return this.$route.params.recipeid;
    },
    recipe() {
      let allRecipes = this.allRecipes;
      let currentRecipe = allRecipes.filter(recipe => {
        return recipe[0] === this.recipeKey;
      });
      if (currentRecipe.length) {
        this.isRecipeOwner = currentRecipe[0][1].ownerID === this.user.id;
        this.recipeLoaded = true;
        return currentRecipe[0][1];
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
  },
  methods: {
    handleUpdate() {
      this.getAllRecipes();
    }
  }
};
</script>
