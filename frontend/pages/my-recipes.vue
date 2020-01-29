<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />
    <h1 class="heading--display-font margin-bottom--large">{{this.firstName}}'s kokebok</h1>
    <nuxt-link
      to="/account/add-recipe"
      class="button button--large button--round margin--auto margin-top--xlarge"
    >Add new recipe</nuxt-link>
    <div class="flex-row margin-top--large">
      <h4
        id="my-recipes-tab"
        @click="event => toggleRecipes(event)"
        :class="'tab margin-right--large ' + (showMyRecipes ? 'tab--active':'')"
      >My recipes</h4>
      <h4 class="margin-right--large">|</h4>
      <h4
        id="shared-recipes-tab"
        @click="event => toggleRecipes(event)"
        :class="'tab ' + (showSharedRecipes ? 'tab--active':'')"
      >Recipes shared with me</h4>
    </div>
    <div class="container">
      <span
        role="button"
        @click="toggleSearchForm"
        class="button button--small button--green-border margin-bottom--large"
      >
        <search-icon class="icon icon--in-button margin-right--medium" v-if="!search" />
        {{search ? "Exit search" : "Search"}}
      </span>
      <recipes-filter
        class="margin-bottom--xlarge margin--auto"
        :recipes="visibleRecipes"
        @filter="setVisibleRecipes"
        v-if="search"
      />
    </div>
    <recipes-list class="margin-top--large padding-bottom--large" :recipes="visibleRecipes" />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
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
      search: false,
      visibleRecipes: []
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

      if (this.user && this.user.displayName) {
        let username = this.user.displayName;
        firstName = /\s/.test(username) ? username.split(" ")[0] : username;
      }
      return firstName;
    },
    userRecipes() {
      return this.$store.getters.recipes;
    },
    sharedRecipes() {
      return this.$store.getters.sharedRecipes;
    }
  },
  methods: {
    toggleSearchForm() {
      this.search = !this.search;
    },
    toggleRecipes(event) {
      if (event.target.id === "my-recipes-tab" && !this.showMyRecipes) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
        this.visibleRecipes = this.userRecipes;
      } else if (
        event.target.id === "shared-recipes-tab" &&
        !this.showSharedRecipes
      ) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
        this.visibleRecipes = this.sharedRecipes;
      }
    },
    setVisibleRecipes(filteredRecipes) {
      this.visibleRecipes = filteredRecipes;
    }
  },
  created() {
    if (this.showMyRecipes) this.visibleRecipes = this.userRecipes;
    else if (this.showSharedRecipes) this.visibleRecipes = this.sharedRecipes;
  }
};
</script>

