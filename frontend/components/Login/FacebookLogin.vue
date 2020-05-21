<template>
  <button outline fab @click="facebookSignIn" class="facebook-btn">
    <img
      class="facebook-btn__logo"
      src="/f_logo_RGB-White_72.png"
      alt="fb logo"
    />
    <span class="facebook-btn__text">Sign in with Facebook</span>
  </button>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
export default {
  name: "facebook-login",
  methods: {
    facebookSignIn() {
      this.$router.push("/login?loading");
      this.$store.dispatch("FACEBOOK_SIGN_IN");
    }
  }
};
</script>
