<template>
  <div v-if="!user">
    <initial-info-section />

    <sign-up-section
      class="container--blue"
      :darkBg="true"
      headline="Sign up to start building your own cookbook"
    />
  </div>

  <div
    class="tablet-width padding-horizontal--large margin-top--xxlarge margin--auto"
    v-else
  >
    <div class="flex-center-container flex-column">
      <h2>Discover public recipes</h2>
      <nuxt-link to="/my-recipes">My cookbook ➔</nuxt-link>
    </div>
    <recipes-filter
      class="margin-bottom--xlarge margin--auto"
      :recipes="recipes"
      @filter="setVisibleRecipes"
    />
    <recipes-list :recipes="visibleRecipes" :publicRecipe="true" />
    <scroll-button />
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import InitialInfoSection from "~/components/InitialInfoSection/InititalInfoSection.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import ScrollButton from "~/components/ScrollButton.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    InitialInfoSection,
    SignUpSection,
    RecipesFilter,
    RecipesList,
    ScrollButton
  },
  data() {
    return {
      filteredRecipes: [],
      filtered: false
    };
  },
  computed: {
    recipes() {
      return this.$store.state.publicRecipes;
    },
    visibleRecipes() {
      if (!this.filtered) return this.recipes;
      if (this.filtered) return this.filteredRecipes;
    }
  },
  mixins: [user],
  methods: {
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  }
};
</script>
