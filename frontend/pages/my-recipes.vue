<template>
  <div class="container container--center tablet-width padding-horizontal--large">
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
      <search-form
        class="margin-bottom--xlarge margin--auto"
        @filterBySearchTerm="setSearchTerm"
        @filterByCategory="setCategory"
        v-if="search"
      />
    </div>
    <recipes-list
      class="margin-top--large padding-bottom--large"
      :recipes="userRecipes"
      v-if="showMyRecipes"
    />
    <recipes-list
      class="margin-top--large padding-bottom--large"
      :recipes="sharedRecipes"
      :publicRecipe="true"
      v-if="showSharedRecipes"
    />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import SearchForm from "~/components/Search/SearchForm.vue";

export default {
  name: "my-recipes",
  components: { RecipesList, SearchForm },
  data() {
    return {
      addingRecipe: false,
      showMyRecipes: true,
      showSharedRecipes: false,
      search: false,
      categories: [],
      searchTerm: ""
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
      let recipes = this.$store.getters.recipes;
      if (recipes) return this.filterRecipes(recipes);
      else return [];
    },
    sharedRecipes() {
      let recipes = this.$store.getters.sharedRecipes;
      if (recipes) return this.filterRecipes(recipes);
      else return [];
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
      } else if (
        event.target.id === "shared-recipes-tab" &&
        !this.showSharedRecipes
      ) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
      }
    },
    setCategory(category) {
      let categoryIndex = this.categories.indexOf(category.value);

      if (category.checked) {
        this.categories.push(category.value);
      } else if (!category.checked && categoryIndex !== -1) {
        this.categories.splice(categoryIndex, 1);
      }
    },
    setSearchTerm(value) {
      this.searchTerm = value;
    },
    filterRecipes(recipes) {
      let categories = this.categories;
      let searchTerm = this.searchTerm;
      let filteredRecipes = [];
      let recipesToBeFiltered = recipes;
      if (recipes && categories.length) {
        categories.forEach(category => {
          let oneOrMoreRecipesOfCategory = -1;
          recipesToBeFiltered.forEach(recipe => {
            if (
              recipe[1].categories &&
              recipe[1].categories.indexOf(category) !== -1
            ) {
              oneOrMoreRecipesOfCategory *= 0;
              if (filteredRecipes && filteredRecipes.indexOf(recipe) === -1)
                filteredRecipes.push(recipe);
            }
          });
        });
        recipesToBeFiltered = filteredRecipes;
      }

      if (recipes && searchTerm !== "") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          return (
            recipe[1].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe[1].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });
      }

      return recipesToBeFiltered;
    }
  }
};
</script>

