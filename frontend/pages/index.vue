<template>
  <div>
    <div v-if="!user">
      <initial-info-section nextSection="addRecipe" />
      <preview
        id="addRecipe"
        headline="Collect your favorite recipes in one place"
        description="Add your personal recipes, or save recipes from anywhere on the web to make sure you don't forget about their existence."
        videoTitle="add-recipe"
        graphicTitle="favorite-cloud"
        :flipGraphic="true"
        nextSection="accessRecipes"
        class="container--light-blue padding-horizontal--medium"
      />
      <preview
        id="accessRecipes"
        headline="Access your recipes wherever you are"
        description="No more searching for your old cookbook or looking around the internet for that recipe you wanted to try. Store them all in one place to access them right away."
        videoTitle="access-recipes"
        graphicTitle="market"
        :flip="true"
        nextSection="changeServings"
        class="container--green padding-horizontal--medium"
      />
      <preview
        id="changeServings"
        headline="Adjust servings to the amount you need"
        description="Don't worry about calculating the amount you need for x servings. Just give us the number."
        videoTitle="change-servings"
        nextSection="addToShoppingList"
        class="container--light-blue padding-horizontal--medium"
      />

      <preview
        id="addToShoppingList"
        headline="Plan and organize your shopping"
        description="With the shopping planner you can easily plan for big events or simply the rest of the week."
        imageTitle="shopping-list"
        :flip="true"
        nextSection="signUp"
        class="container--green padding-horizontal--medium"
      />

      <sign-up-section
        id="signUp"
        class="container--full-height container--blue padding-top--xxxlarge"
        :darkBg="true"
        headline="Sign up to start building your own cookbook"
        :bigHeadline="true"
      />
    </div>

    <div class="tablet-width padding-horizontal--medium margin-top--xxlarge margin--auto" v-else>
      <div class="flex-center-container flex-column">
        <h2>Discover public recipes</h2>
        <nuxt-link to="/account/my-cookbook/">My cookbook ➔</nuxt-link>
      </div>
      <recipes-filter
        class="margin-bottom--xlarge margin-top--large margin-left--xsmall margin--auto"
        :recipes="publicRecipes"
        @filter="setVisibleRecipes"
      />
      <recipes-list :recipes="visibleRecipes" :publicRecipe="true" />
    </div>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import InitialInfoSection from "~/components/InitialInfoSection/InititalInfoSection.vue";
import Preview from "~/components/Preview.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import RecipesFilter from "~/components/Filter/RecipesFilter.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    InitialInfoSection,
    Preview,
    SignUpSection,
    RecipesFilter,
    RecipesList
  },
  data() {
    return {
      filteredRecipes: [],
      filtered: false
    };
  },
  mixins: [user, publicRecipes],
  computed: {
    visibleRecipes() {
      if (!this.filtered) return this.publicRecipes;
      if (this.filtered) return this.filteredRecipes;
    }
  },
  methods: {
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  }
};
</script>
