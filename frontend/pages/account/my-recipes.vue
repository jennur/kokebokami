<template>
  <div class="container">
    <div class="container container--center tablet-width">
      <h2 class="heading--display-font margin-bottom--large">{{this.firstName}}'s kokebok</h2>
      <nuxt-link
        to="/account/add-recipe"
        class="button button--large button--round margin--auto margin-top--medium"
      >Add new recipe</nuxt-link>
      <h3 v-if="!recipesLength">It seems like your cook book is empty!</h3>
      <recipes-list class="padding--large" />
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
    recipesLength() {
      return this.$store.getters.recipes.length;
    }
  },
  methods: {}
};
</script>

