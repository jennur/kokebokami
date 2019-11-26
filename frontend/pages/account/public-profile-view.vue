<template>
  <section class="tablet-width padding-horizontal--large margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <profile-view :user="user" />
    <h3>Check out my recipes</h3>
    <recipes-list :recipes="currentUsersPublicRecipes ? currentUsersPublicRecipes : []" />
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/Recipes/RecipesList";

export default {
  name: "profile",
  components: { ProfileView, RecipesList },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My account", link: "/account" },
        { name: "My public profile" }
      ]
    }
  },
  mixins: [user],
  computed: {
    currentUsersPublicRecipes() {
      let publicRecipes = this.$store.getters.publicRecipes;
      let currentUsersPublicRecipes = publicRecipes.filter(recipe => {
        return recipe[1].ownerID === this.user.id;
      });

      return currentUsersPublicRecipes;
    }
  }
};
</script>

