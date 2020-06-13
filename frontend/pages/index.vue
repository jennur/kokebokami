<template>
  <div>
    <div v-if="!user">
      <initial-info-section class="padding-vertical--xxlarge" nextSection="lookup" />

      <preview id="lookup" class="padding--large" />

      <sign-up-section
        class="container--blue"
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
