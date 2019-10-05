<template>
  <div class="container">
    <button outline fab @click="googleSignIn" class="google-btn">
      <googleLogo />
      <span class="google-btn__text">Sign with Google</span>
    </button>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapMutations } from "vuex";

import { GoogleProvider, auth } from "~/services/firebase.js";
import Logo from "~/components/Logo.vue";
import fontawesome from "nuxt-fontawesome";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";

export default {
  components: {
    fontawesome,
    googleLogo,
    Logo
  },
  methods: {
    googleSignIn() {
      auth
        .signInWithPopup(GoogleProvider)
        .then(result => {
          this.$store.dispatch("SET_USER", result);
          return result;
        })
        .then(user => {
          this.$router.push("/account");
          console.log("COUNT::: " + this.$store.state.count);
          console.log("USER::: " + this.$store.state.user);
        })
        .catch(e => {
          console.log(e);
        });
    }
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

.google-btn {
  display: inline-flex;
  align-items: center;
  padding: 0px;
  box-sizing: border-box;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  background-color: #4285f4;
  color: #fff;
  cursor: pointer;
}

.google-btn__text {
  margin: 0px 15px;
}
</style>
