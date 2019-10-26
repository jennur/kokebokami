<template>
  <div class="login-container">
    <google-login />
    <facebook-login />
    <div class="margin-top--medium">
      <button
        class="button button--transparent"
        @click="toggleLoginModal"
      >➔ Sign in with username and password</button>
      <kokebokami-login :open="loginModalOpen" @toggle="toggleLoginModal" />
    </div>
    <div class="login-container__system-message" v-if="systemMessage">
      <p>{{systemMessage}}</p>
    </div>
  </div>
</template>

<script>
import GoogleLogin from "./GoogleLogin.vue";
import FacebookLogin from "./FacebookLogin.vue";
import KokebokamiLogin from "./KokebokamiLogin.vue";

import { user } from "~/mixins/getCurrentUser.js";
import { auth } from "~/plugins/firebase.js";

export default {
  name: "login-container",
  components: {
    GoogleLogin,
    FacebookLogin,
    KokebokamiLogin
  },
  data() {
    return { systemMessage: "", loginModalOpen: false };
  },
  computed: {},
  mixins: [user],
  watch: {
    user(value) {
      if (value !== undefined && value !== null) {
        this.$router.push("/account");
      }
    }
  },
  created: function() {
    auth
      .getRedirectResult()
      .then(response => {
        if (response.user !== null) {
          let user = {
            id: response.user.uid,
            profileImg: response.user.photoURL,
            name: response.user.displayName
          };
          this.$store.dispatch("SET_USER", user);
        }
      })
      .catch(e => {
        console.log(e.message);
        this.systemMessage = e.message;
      });
  },
  methods: {
    toggleLoginModal() {
      this.loginModalOpen = !this.loginModalOpen;
    }
  }
};
</script>
