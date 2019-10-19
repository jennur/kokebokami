<template>
  <div class="container">
    <h1 class="heading--display-font" v-if="!user">Welcome to your online cook book!</h1>
    <div class="flex-center-container">
      <kokeboka class="graphic--kokeboka" />
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
