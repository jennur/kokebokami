<template>
  <div>
    <div v-if="user && !user.id">
      <initial-info-section />
    </div>

    <div class="desktop-width padding-horizontal--large margin-top--xxlarge margin--auto">
      <button
        class="search__button button button--small button--green-border margin--medium"
        @click="event => toggleSearch(event)"
      >Search</button>
      <div class="flex-row flex-row--nowrap">
        <recipe-search
          :class="{ 'search--open': searchOpen }"
          :recipes="publicRecipes"
          @search="setVisibleRecipes"
          v-click-outside="event => closeSearch(event)"
        />
        <recipes-list
          v-if="loaded"
          :recipes="visibleRecipes"
          :isPublicList="true"
          addRecipeUrl="/account/add-recipe"
        />
        <div v-else class="container">
          <span class="simple-loading-spinner margin--auto" />
        </div>
      </div>
    </div>
    <sign-up-section
      id="signUp"
      class="container--full-height container--blue padding-top--xxxlarge"
      :darkBg="true"
      headline="Sign up to start building your own cookbook"
      :bigHeadline="true"
    />
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import user from "~/mixins/user.js";
import publicRecipes from "~/mixins/publicRecipes.js";

import InitialInfoSection from "~/components/InitialInfoSection/InititalInfoSection.vue";
import Preview from "~/components/Preview.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipeSearch from "~/components/Search/RecipeSearch.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    InitialInfoSection,
    Preview,
    SignUpSection,
    RecipeSearch,
    RecipesList,
  },
  data() {
    return {
      filteredRecipes: [],
      filtered: false,
      searchOpen: false,
    };
  },
  mixins: [user, publicRecipes],
  computed: {
    visibleRecipes() {
      if (!this.filtered) return this.publicRecipes;
      if (this.filtered) return this.filteredRecipes;
    },
  },
  methods: {
    closeSearch(event) {
      event && event.stopPropagation();
      this.searchOpen = false;
    },
    toggleSearch(event) {
      event && event.stopPropagation();
      this.searchOpen = !this.searchOpen;
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>
