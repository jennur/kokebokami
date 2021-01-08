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
          :isRecipeOwner="user && user.id === recipe.ownerID"
          @update="handleUpdate"
        />
      </expand-transition>

      <comments-section
        v-if="recipeLoaded"
        class="tablet-width margin--auto margin-top--xxlarge"
        :recipeKey="recipe.id"
        :recipeOwnerID="recipe.ownerID"
        :recipeTitle="recipe.title"
      />
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import getRecipe from "~/mixins/get-recipe.js";
import publicRecipes from "~/mixins/public-recipes.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import RecipeFullView from "~/components/RecipeFullView/RecipeFullView.vue";
import CommentsSection from "~/components/CommentsSection/CommentsSection.vue";

export default {
  name: "recipe",
  components: {
    RecipeFullView,
    CommentsSection,
    ExpandTransition
  },
  head() {
    let title = this.recipe.title || "";
    return { ...this.headData, title: `${title} | Kokebokami` }; // from getRecipe
  },
  mixins: [user, getRecipe],
  computed: {
    path() {
      return this.$route.path;
    },
    breadcrumbs() {
      if (this.user && this.user.id === this.recipe.ownerID)
        return [
          { name: this.$t("navigation.home"), link: "/" },
          {
            name: this.$t("navigation.myAccount"),
            link: "/account/"
          },
          {
            name: this.$t("navigation.myCookbook"),
            link: "/account/my-cookbook/"
          },
          { name: this.recipe.title }
        ];
      return [
        { name: this.$t("navigation.recipes"), link: "/" },
        { name: this.recipe.title }
      ];
    }
  },
  methods: {
    handleUpdate() {
      this.getRecipe(this.recipe.id);
    }
  },
  mounted(){
    let recipeKey = this.$route.query.id;
    if(recipeKey) this.getRecipe(recipeKey)
    else this.getRecipeKey();
  }
};
</script>
