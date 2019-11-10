<template>
  <div class="login-container">
    <h2 class="heading--display-font margin-bottom--xlarge">Log in to see kokeboka di</h2>

    <google-login class="margin-bottom--medium" />
    <facebook-login class="margin-bottom--medium" />
    <div class="margin-top--medium">
      <button
        class="button button--large button--transparent"
        @click="toggleLoginModal"
      >➔ Sign in with username and password</button>
      <kokebokami-login :open="loginModalOpen" @toggle="toggleLoginModal" />
    </div>
    <div class="system-message margin-top--medium" v-if="systemMessage">
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
        this.$router.push("/my-recipes");
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
            photoURL: response.user.photoURL,
            name: response.user.displayName
          };
          this.$store.dispatch("SET_USER", user);
        }
      })
      .catch(e => {
        console.log("ERROR SIGNING IN:::" + e);
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
