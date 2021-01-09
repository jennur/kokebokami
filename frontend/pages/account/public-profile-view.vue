<template>
  <section>
    <breadcrumbs :routes="breadcrumbs" />
    <div class="system-message margin-vertical--large">
      {{ $t("accountDetails.publicProfileViewNote") }}
    </div>
    <profile-view :user="user && !user.hiddenProfile ? user : null" />
    <h3>{{ $t("cooks.checkOutMyRecipes") }}</h3>
    <recipes-list
      :recipes="currentUsersPublicRecipes ? currentUsersPublicRecipes : []"
    />
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import publicRecipes from "~/helpers/get-public-recipes.js";

import ProfileView from "~/components/ProfileView.vue";
import RecipesList from "~/components/RecipePreview/RecipesList";

export default {
  name: "profile",
  head() {
    return {
      title: `Profile preview | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/public-profile-view/"
        }
      ]
    };
  },
  components: { ProfileView, RecipesList },
  mixins: [user, publicRecipes],
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        {
          name: this.$t("navigation.myAccount"),
          link: "/account/"
        },
        {
          name: this.$t("navigation.accountDetails"),
          link: "/account/account-details/"
        },
        { name: this.$t("navigation.publicProfileView") }
      ];
    },
    currentUsersPublicRecipes() {
      let publicRecipes = this.publicRecipes;
      let currentUsersPublicRecipes = publicRecipes.filter(recipe => {
        return recipe.ownerID === this.user.id;
      });

      return currentUsersPublicRecipes;
    }
  }
};
</script>
