<template>
  <section class="tablet-width padding-horizontal--large margin--auto">
    <breadcrumbs :routes="breadcrumbs" />
    <profile-view class="margin-top--xxlarge" :user="user ? user[1] : {}" />
    <h3>Check out my recipes</h3>
    <recipes-list :recipes="currentUsersPublicRecipes" />
  </section>
</template>
<script>
import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/RecipesList";

export default {
  name: "public-profile",
  components: { ProfileView, RecipesList },
  computed: {
    userID() {
      return this.$route.params.userid;
    },
    user() {
      let users = this.$store.getters.allUsers;
      if (users) {
        return users.find(user => {
          return user[0] === this.userID;
        });
      }
    },
    breadcrumbs() {
      if (this.user) {
        return [
          { name: "Home", link: "/" },
          { name: "Cooks", link: "/cooks" },
          { name: `${this.user[1].displayName}` }
        ];
      }
    },
    currentUsersPublicRecipes() {
      let publicRecipes = this.$store.getters.publicRecipes;
      let currentUsersPublicRecipes = [];
      if (this.user) {
        currentUsersPublicRecipes = publicRecipes.filter(recipe => {
          return recipe[1].ownerID === this.user[0];
        });
      }
      return currentUsersPublicRecipes;
    }
  }
};
</script>
