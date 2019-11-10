<template>
  <div class="container container--center tablet-width padding-horizontal--large">
    <breadcrumbs :routes="breadcrumbs" />
    <h2 class="heading--display-font margin-bottom--large">{{this.firstName}}'s kokebok</h2>
    <nuxt-link
      to="/account/add-recipe"
      class="button button--large button--round margin--auto margin-top--medium"
    >Add new recipe</nuxt-link>
    <recipes-list headline="Your recipes" class="padding-bottom--large" :recipes="userRecipes" />
    <recipes-list
      headline="Recipes shared with you"
      class="padding-bottom--large"
      :recipes="sharedRecipes"
      :publicRecipe="true"
    />
  </div>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "my-recipes",
  components: { RecipesList },
  data() {
    return { addingRecipe: false };
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
  methods: {}
};
</script>

