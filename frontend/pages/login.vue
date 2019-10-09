<template>
  <div class="container">
    <div class="login-container">
      <GoogleLogin />
      <FacebookLogin />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import GoogleLogin from "~/components/GoogleLogin.vue";
import FacebookLogin from "~/components/FacebookLogin.vue";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Login",
  components: {
    GoogleLogin,
    FacebookLogin
  },
  mixins: [user],
  watch: {
    user(value) {
      if (value !== undefined && value !== null) {
        this.$router.push("/account");
      }
    }
  }
};
</script>
