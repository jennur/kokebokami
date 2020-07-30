<template>
  <div>
    <breadcrumbs class="margin-bottom--large" :routes="breadcrumbs" />
    <div class="tablet-width margin-top--xxlarge margin--auto">
      <expand-transition :show="recipeLoaded" slower>
        <recipe-full-view
          class="margin-bottom--xxlarge"
          :recipe="recipe"
          :recipeKey="recipeKey"
          :isRecipeOwner="user.id === recipe.ownerID"
          :recipeOwnerID="recipe.ownerID"
          @update="handleUpdate"
        />
      </expand-transition>

      <comments-section
        class="tablet-width margin--auto margin-top--xxlarge"
        :recipeKey="recipeKey"
        :recipeOwnerID="recipe.ownerID"
      />
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import allUsers from "~/mixins/allUsers.js";
import getRecipe from "~/mixins/getRecipe.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import RecipeFullView from "~/components/Recipes/RecipeFullView/RecipeFullView.vue";
import CommentsSection from "~/components/CommentsSection/CommentsSection.vue";

export default {
  name: "recipe",
  components: {
    RecipeFullView,
    CommentsSection,
    ExpandTransition
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
  mixins: [user, allUsers, getRecipe],
  computed: {
    path() {
      return this.$route.path;
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

      if (this.recipe && this.user.id !== this.recipe.ownerID) {
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
      this.getRecipe();
    }
  }
};
</script>
