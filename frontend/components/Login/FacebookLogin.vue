<template>
  <button outline fab @click="facebookSignIn" class="facebook-btn">
    <img
      class="facebook-btn_logo"
      src="/f_logo_RGB-White_72.png"
      alt="fb logo"
    />
    <span class="facebook-btn_text">{{ $t("loginWith") }} Facebook</span>
  </button>
</template>
<script>
import user from "~/mixins/user.js";
export default {
  name: "facebook-login",
  methods: {
    facebookSignIn() {
      this.$router.push(this.localePath("/login?loading"));
      const FacebookProvider = new this.$fireModule.auth.FacebookAuthProvider();
      this.$fire.auth.signInWithRedirect(FacebookProvider);
    }
  }
};
</script>
