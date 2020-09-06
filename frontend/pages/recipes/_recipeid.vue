<template>
  <div>
    <div class="flex-center-container" v-if="!recipeLoaded">
      <span class="simple-loading-spinner" />
    </div>
    <breadcrumbs
      v-if="recipeLoaded"
      class="margin-bottom--large"
      :routes="breadcrumbs"
    />
    <div class="tablet-width margin-top--xxlarge margin--auto">
      <expand-transition :show="recipeLoaded" slower>
        <recipe-full-view
          class="margin-bottom--xxlarge"
          :recipe="recipe"
          :recipeKey="recipeKey"
          :isRecipeOwner="user && user.id === recipe.ownerID"
          :recipeOwnerID="recipe.ownerID"
          :recipeOwnerDisplayName="recipeOwner.displayName"
          @update="handleUpdate"
        />
      </expand-transition>

      <comments-section
        v-if="recipeLoaded"
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
    return this.headData;
  },
  mixins: [user, getRecipe],
  computed: {
    path() {
      return this.$route.path;
    },
    breadcrumbs() {
      if (this.user && this.user.id === this.recipe.ownerID)
        return [
          { name: "Home", link: "/" },
          { name: "My account", link: "/account/" },
          { name: "My cookbook", link: "/account/my-cookbook/" },
          { name: this.recipe.title }
        ];
      return [{ name: "Recipes", link: "/" }, { name: this.recipe.title }];
    }
  },
  methods: {
    handleUpdate() {
      this.getRecipe();
    }
  }
};
</script>
