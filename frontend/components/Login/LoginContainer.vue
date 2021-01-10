<template>
  <ul class="login-container">
    <li>
      <google-login class="margin-bottom-md" />
    </li>
    <li>
      <facebook-login class="margin-bottom-md" />
    </li>
    <li>
      <kokebokami-button @click.native="toggleLoginModal" />
    </li>
    <kokebokami-login :open="loginModalOpen" @toggle="toggleLoginModal" @logged-in="$emit('update')" />

  </ul>
</template>

<script>
import GoogleLogin from "./GoogleLogin.vue";
import FacebookLogin from "./FacebookLogin.vue";
import KokebokamiButton from "./KokebokamiButton.vue";
import KokebokamiLogin from "./KokebokamiLogin.vue";

import user from "~/mixins/user.js";

export default {
  name: "login-container",
  components: {
    GoogleLogin,
    FacebookLogin,
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
