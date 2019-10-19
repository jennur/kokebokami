<template>
  <div class="flex-center-container flex-center-container--column">
    <div class="login-container">
      <GoogleLogin />
      <FacebookLogin />
      <div class="login-container__system-message" v-if="systemMessage">
        <p>{{systemMessage}}</p>
      </div>
    </div>
    <div class="container">
      <kokebokapen class="graphic graphic--kokebokapen" />
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import GoogleLogin from "~/components/GoogleLogin.vue";
import FacebookLogin from "~/components/FacebookLogin.vue";
import { user } from "~/mixins/getCurrentUser.js";
import kokebokapen from "~/assets/graphics/kokebokapen.svg";

export default {
  name: "Login",
  components: {
    GoogleLogin,
    FacebookLogin,
    kokebokapen
  },
  mixins: [user],
  computed: {
    systemMessage() {
      return this.$store.getters.systemMessage;
    }
  },
  watch: {
    user(value) {
      if (value !== undefined && value !== null) {
        this.$router.push("/account");
      }
    }
  }
};
</script>
