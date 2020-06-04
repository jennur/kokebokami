<template>
  <section class="login-container">
    <h2 class="margin-bottom--xlarge">Log in to kokeboka di</h2>
    <!-- Social Media login -->
    <google-login class="margin-bottom--medium" />
    <facebook-login class="margin-bottom--medium" />

    <!-- Kokebokami login -->
    <div class="margin-top--medium">
      <button
        class="button button--large button--transparent"
        @click="toggleLoginModal"
      >
        ➔ Sign in with username and password
      </button>
      <kokebokami-login :open="loginModalOpen" @toggle="toggleLoginModal" />
    </div>
  </section>
</template>

<script>
import GoogleLogin from "./GoogleLogin.vue";
import FacebookLogin from "./FacebookLogin.vue";
import KokebokamiLogin from "./KokebokamiLogin.vue";

import user from "~/mixins/user.js";

export default {
  name: "login-container",
  components: {
    GoogleLogin,
    FacebookLogin,
    KokebokamiLogin
  },
  data() {
    return { loginModalOpen: false };
  },
  mixins: [user],
  methods: {
    toggleLoginModal() {
      this.loginModalOpen = !this.loginModalOpen;
    }
  }
};
</script>
