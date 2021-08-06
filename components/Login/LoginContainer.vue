<template>
  <ul class="login-container">
    <li>
      <google-login class="margin-bottom-md" tabindex="0" />
    </li>
    <li>
      <kokebokami-button @click.native="toggleLoginModal" tabindex="0" />
    </li>

    <kokebokami-login :open="loginModalOpen" @toggle="toggleLoginModal" @logged-in="$emit('update')" />
  </ul>
</template>

<script>
import GoogleLogin from "./GoogleLogin.vue";
import KokebokamiButton from "./KokebokamiButton.vue";
import KokebokamiLogin from "./KokebokamiLogin.vue";

import user from "~/mixins/user.js";

export default {
  name: "login-container",
  components: {
    GoogleLogin,
    KokebokamiButton,
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
