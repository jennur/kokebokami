<template>
  <div class="container">
    <div class="container container--center tablet-width">
      <h2 class="heading--display-font margin-bottom--large">{{this.firstName}}'s kokebok</h2>
      <nuxt-link
        to="/account/add-recipe"
        class="button button--large button--round margin--auto margin-top--medium"
      >Add new recipe</nuxt-link>
      <recipes-list headline="Your recipes" class="padding--large" :recipes="userRecipes" />
      <recipes-list
        headline="Recipes shared with you"
        class="padding--large"
        :recipes="sharedRecipes"
        :publicRecipe="true"
      />
    </div>
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import BreadCrumbs from "~/components/Navigation/BreadCrumbs.vue";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "my-recipes",
  components: { BreadCrumbs, RecipesList },
  data() {
    return { addingRecipe: false };
  },
  mixins: [user],
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }]
    }
  },
  computed: {
    firstName() {
      let firstName = null;

      if (this.user && this.user.name) {
        let username = this.user.name;
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
  methods: {}
};
</script>

