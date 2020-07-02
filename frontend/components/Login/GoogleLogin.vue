<template>
  <button outline fab @click="googleSignIn" class="google-btn">
    <googleLogo />
    <span class="google-btn__text">Sign in with Google</span>
  </button>
</template>
<script>
import googleLogo from "~/assets/graphics/icons/btn_google_light_normal_ios.svg";
import user from "~/mixins/user.js";

export default {
  name: "google-login",
  components: {
    googleLogo
  },
  methods: {
    googleSignIn() {
      this.$router.push("/login?loading");
      const GoogleProvider = new this.$fireAuthObj.GoogleAuthProvider();
      this.$fireAuth.signInWithRedirect(GoogleProvider);
    }
  }
};
</script>
