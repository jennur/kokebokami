<template>
  <div v-if="!user">
    <section class="container">
      <div
        class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
      >
        <h1 class="heading--display-font">It's time to digitalize your cook book!</h1>
        <p
          class="padding-horizontal--large color--blue font-size--medium text-align--center"
        >Start storing your personal recipes online to make sure they never get lost. Keep them private, share them with the public or your friends only.</p>
        <nuxt-link
          to="/sign-up"
          class="button button--large padding-horizontal--xlarge margin-top--large"
          v-if="!user"
        >Get started ➔</nuxt-link>
      </div>
      <div class="flex-center-container">
        <kokeboka class="graphic graphic--kokeboka" />
      </div>
    </section>
    <sign-up-section class="container--blue" :darkBg="true" />
  </div>
  <div v-else>
    <recipes-list :recipes="publicRecipes" :publicRecipe="true" />
  </div>
</template>

<script>
import firebase from "firebase";
import { GoogleProvider, auth } from "~/plugins/firebase.js";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";
import kokeboka from "~/assets/graphics/kokeboka.svg";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "Home",
  components: {
    kokeboka,
    SignUpSection,
    RecipesList
  },
  mixins: [user],
  computed: {
    publicRecipes() {
      let recipes = this.$store.getters.publicRecipes;
      return recipes;
    }
  }
};
</script>
