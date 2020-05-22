<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom--large">{{ headlineText }}</h1>
    <div class="flex-column">
      <nuxt-link
        to="/account/add-recipe"
        class="button button--large button--round margin--auto margin-vertical--xlarge"
        >Add new recipe</nuxt-link
      >
      <nuxt-link to="/account/add-recipe-from-url"
        >Add recipe from url ➔</nuxt-link
      >
    </div>
    <div class="flex-row margin-top--large">
      <h4
        id="my-recipes-tab"
        @click="event => toggleRecipes(event)"
        :class="
          'tab margin-right--large ' + (showMyRecipes ? 'tab--active' : '')
        "
      >
        My recipes
      </h4>
      <h4 class="margin-right--large">|</h4>
      <h4
        id="shared-recipes-tab"
        @click="event => toggleRecipes(event)"
        :class="'tab ' + (showSharedRecipes ? 'tab--active' : '')"
      >
        Recipes shared with me
      </h4>
    </div>
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
      :publicRecipe="showSharedRecipes"
    />
  </div>
</template>

<script>
import user from "~/mixins/user.js";
import sharedRecipes from "~/mixins/sharedRecipes.js";
import userRecipes from "~/mixins/userRecipes.js";

import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";

export default {
  name: "my-recipes",
  components: { RecipesList, RecipesFilter },
  data() {
    return {
      addingRecipe: false,
      showMyRecipes: true,
      showSharedRecipes: false,
      filteredRecipes: [],
      filtered: false,
      filteredKind: ""
    };
  },
  mixins: [user],
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "My recipes" }]
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
    /* userRecipes() {
      return this.$store.state.recipes;
    },
    sharedRecipes() {
      return this.$store.state.sharedRecipes;
    }, */
    visibleRecipes() {
      if (this.showMyRecipes) {
        if (!this.filtered) return this.userRecipes;
        if (this.filtered && this.filteredKind === "myRecipes")
          return this.filteredRecipes;
        else if (this.filtered && this.filteredKind === "sharedRecipes")
          return this.userRecipes;
      } else if (this.showSharedRecipes) {
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
    toggleRecipes(event) {
      if (event.target.id === "my-recipes-tab" && !this.showMyRecipes) {
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
