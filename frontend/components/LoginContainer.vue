<template>
  <div class="login-container">
    <GoogleLogin />
    <FacebookLogin />
    <div class="login-container__system-message" v-if="systemMessage">
      <p>{{systemMessage}}</p>
    </div>
  </div>
</template>

<script>
import GoogleLogin from "~/components/GoogleLogin.vue";
import FacebookLogin from "~/components/FacebookLogin.vue";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "login-container",
  components: {
    GoogleLogin,
    FacebookLogin
  },
  computed: {
    systemMessage() {
      return this.$store.getters.systemMessage;
    }
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
