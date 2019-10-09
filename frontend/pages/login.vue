<template>
  <div class="container">
    <div class="login-container">
      <button outline fab @click="googleSignIn" class="google-btn">
        <googleLogo />
        <span class="google-btn__text">Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Login",
  components: {
    googleLogo
  },
  mixins: [user],
  watch: {
    user(value) {
      if (value !== undefined && value !== null) {
        this.$router.push("/account");
      }
    }
  },
  methods: {
    googleSignIn() {
      this.$store.dispatch("GOOGLE_SIGN_IN");
      this.$router.push("/account");
    }
  }
};
</script>
