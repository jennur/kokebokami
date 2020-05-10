<template>
  <button outline fab @click="googleSignIn" class="google-btn">
    <googleLogo />
    <span class="google-btn__text">Sign in with Google</span>
  </button>
</template>
<script>
import googleLogo from "~/assets/graphics/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "google-login",
  components: {
    googleLogo
  },
  methods: {
    googleSignIn() {
      this.$router.push("/login?loading");
      this.$store.dispatch("GOOGLE_SIGN_IN");
    }
  }
};
</script>
