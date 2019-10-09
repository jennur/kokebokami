<template>
  <button outline fab @click="facebookSignIn" class="facebook-btn">
    <span class="facebook-btn__text">Sign in with Facebook</span>
  </button>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "FacebookLogin",
  components: {
    //facebookLogo
  },
  methods: {
    facebookSignIn() {
      this.$store.dispatch("FACEBOOK_SIGN_IN");
      this.$router.push("/account");
    }
  }
};
</script>
