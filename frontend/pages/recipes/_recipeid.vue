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
        :recipeOwner="recipeOwner"
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
    let recipe = this.recipe;
    let recipeTitle = recipe.title ? recipe.title : "Untitled recipe";
    let recipeDescription = recipe.description
      ? recipe.description
      : "No description available";
    let recipeImage = recipe.photoURL
      ? recipe.photoURL
      : "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=8c3e8a1a-4226-453b-a256-0ac1060adb59";
    return {
      title: `${this.recipe.title} | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: `https://www.kokebokami.com/recipes/${this.recipeKey}/`
        }
      ],
      meta: [
        {
          property: "og:url",
          content: `https://wwww.kokebokami.com/recipes/${this.recipeKey}/`
        },
        {
          property: "og:type",
          content: `article`
        },
        {
          property: "og:title",
          content: recipeTitle
        },
        {
          property: "og:description",
          content: recipeDescription
        },
        {
          property: "og:image",
          content: recipeImage
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: this.structuredData
        }
      ]
    };
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
