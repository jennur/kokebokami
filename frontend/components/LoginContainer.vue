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
import { auth } from "~/plugins/firebase.js";
export default {
  name: "login-container",
  components: {
    GoogleLogin,
    FacebookLogin
  },
  data() {
    return { systemMessage: "" };
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
  }
};
</script>
