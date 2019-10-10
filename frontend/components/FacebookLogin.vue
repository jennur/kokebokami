<template>
  <button outline fab @click="facebookSignIn" class="facebook-btn">
    <img class="facebook-btn__logo" src="~/static/f_logo_RGB-White_72.png" alt="facebook logo" />
    <span class="facebook-btn__text">Sign in with Facebook</span>
  </button>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";
import { facebookLogo } from "~/static/f_logo_RGB-White_72.png";
export default {
  name: "FacebookLogin",
  components: {
    facebookLogo
  },
  methods: {
    facebookSignIn() {
      this.$store.dispatch("FACEBOOK_SIGN_IN");
      //this.$router.push("/account");
    }
  }
};
</script>
