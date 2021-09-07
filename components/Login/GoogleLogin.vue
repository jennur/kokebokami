<template>
  <button outline fab @click="googleSignIn" class="google-btn">
    <googleLogo />
    <span class="google-btn_text">{{ $t("signinWith") }} Google</span>
  </button>
</template>
<script>
import googleLogo from "~/assets/graphics/icons/btn_google_light_normal_ios.svg";

export default {
  name: "google-login",
  components: {
    googleLogo
  },
  methods: {
    googleSignIn() {
      this.$store.dispatch("SHOW_LOADING_SPLASH", true);
      const GoogleProvider = new this.$fireModule.auth.GoogleAuthProvider();
      this.$fire.auth.signInWithRedirect(GoogleProvider);
    }
  }
};
</script>
