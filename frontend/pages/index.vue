<template>
  <div class="container">
    <h1 v-if="!user">Welcome to Kokebokami!</h1>
  </div>
</template>

<script>
import firebase from "firebase";
import { GoogleProvider, auth } from "~/plugins/firebase.js";
import { Navigation } from "~/components/Navigation.vue";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Home",
  components: {},
  mixins: [user],
  created: function() {
    console.log("INDEX USER::: " + this.user);
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
