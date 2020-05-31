<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom--large">{{ headlineText }}</h1>
    <div class="flex-column">
      <nuxt-link
        to="/account/add-recipe/"
        class="button button--large button--round margin--auto margin-vertical--xlarge"
      >Add new recipe</nuxt-link>
      <nuxt-link to="/account/my-recipe-collection/" class="margin--auto">Add new recipe from URL</nuxt-link>
    </div>
    <Tabs
      :tabTitles="['My personal recipes', 'My saved recipes', 'Recipes shared with me']"
      @switchTab="(index) => handleTabSwitch(index)"
    >
      <div class="container">
        <recipes-filter
          class="margin-bottom--xlarge margin--auto"
          :recipes="recipesToBeFiltered"
          @filter="setVisibleRecipes"
        />
      </div>
      <recipes-list
        class="margin-top--large padding-bottom--large"
        :recipes="visibleRecipes"
        :publicRecipe="activeTabIndex === 2"
      />
    </Tabs>
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import sharedRecipes from "~/mixins/sharedRecipes.js";
import userRecipes from "~/mixins/userRecipes.js";

import Tabs from "~/components/Tabs.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";

export default {
  name: "my-cookbook",
  components: { Tabs, RecipesList, RecipesFilter },
  data() {
    return {
      addingRecipe: false,
      showMyRecipes: true,
      showSharedRecipes: false,
      filteredRecipes: [],
      filtered: false,
      filteredKind: "",
      activeTabIndex: 0
    };
  },
  mixins: [user, userRecipes, sharedRecipes],
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "My cookbook" }]
    }
  },
  computed: {
    firstName() {
      let firstName = null;
      let user = this.user;
      if (user && user.displayName && user.displayName !== "User") {
        let username = user.displayName;
        firstName = /\s/.test(username) ? username.split(" ")[0] : username;
      }
      return firstName;
    },
    headlineText() {
      if (this.firstName) return `${this.firstName}'s kokebok`;
      else return "My kokebok";
    },
    visibleRecipes() {
      if (this.activeTabIndex === 0) {
        if (!this.filtered) return this.userRecipes;
        if (this.filtered && this.filteredKind === "myRecipes")
          return this.filteredRecipes;
        else if (this.filtered && this.filteredKind === "sharedRecipes")
          return this.userRecipes;
      } else if (this.activeTabIndex === 2) {
        if (!this.filtered) return this.sharedRecipes;
        if (this.filtered && this.filteredKind === "sharedRecipes")
          return this.filteredRecipes;
        else if (this.filtered && this.filteredKind === "myRecipes")
          return this.sharedRecipes;
      }
    },
    recipesToBeFiltered() {
      if (this.showMyRecipes) {
        return this.userRecipes;
      } else if (this.showSharedRecipes) {
        return this.sharedRecipes;
      }
    }
  },
  methods: {
    handleTabSwitch(index) {
      this.activeTabIndex = index;
    },
    toggleRecipes(event) {
      if (event.target.id === "my-cookbook-tab" && !this.showMyRecipes) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
      } else if (
        event.target.id === "shared-recipes-tab" &&
        !this.showSharedRecipes
      ) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
      }
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
      if (this.showMyRecipes) this.filteredKind = "myRecipes";
      if (this.showSharedRecipes) this.filteredKind = "sharedRecipes";
    }
  }
};
</script>
