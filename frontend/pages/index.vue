<template>
  <div v-if="!user">
    <initial-info-section />

    <sign-up-section
      class="container--blue"
      :darkBg="true"
      headline="Sign up to start building your own cookbook."
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
    <span
      tabindex="0"
      role="button"
      @click="toggleSearchForm"
      @keydown="
        event => {
          event.keyCode === 13 && toggleSearchForm();
        }
      "
      class="button button--small button--green-border margin-bottom--large"
    >
      <search-icon
        class="icon icon--in-button margin-right--medium"
        v-if="!search"
      />
      {{ search ? "Exit search" : "Search" }}
    </span>
    <recipes-filter
      v-if="search"
      class="margin-bottom--xlarge margin--auto"
      :recipes="recipes"
      @filter="setVisibleRecipes"
    />
    <recipes-list :recipes="visibleRecipes" :publicRecipe="true" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import InitialInfoSection from "~/components/InitialInfoSection/InititalInfoSection.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    InitialInfoSection,
    SignUpSection,
    RecipesFilter,
    RecipesList
  },
  data() {
    return {
      search: false,
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
    toggleSearchForm() {
      this.search = !this.search;
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  }
};
</script>
