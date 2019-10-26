<template>
  <div class="container">
    <div class="flex-center-container flex-center-container--column margin--auto">
      <h1 class="heading--display-font">Welcome to your online cook book!</h1>

      <nuxt-link
        to="/login"
        class="button button--large margin-top--large"
        v-if="!user"
      >Get started ➔</nuxt-link>
    </div>
    <div class="flex-center-container">
      <kokeboka class="graphic graphic--kokeboka" />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { GoogleProvider, auth } from "~/plugins/firebase.js";
import { Navigation } from "~/components/Navigation.vue";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";
import kokeboka from "~/assets/graphics/kokeboka.svg";
export default {
  name: "Home",
  components: { kokeboka },
  mixins: [user]
};
</script>
