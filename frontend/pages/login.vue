<template>
  <div class="container">
    <div class="login-container">
      <h2>Log in</h2>
      <button outline fab @click="googleSignIn" class="google-btn">
        <googleLogo />
        <span class="google-btn__text">Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Login",
  components: {
    googleLogo
  },
  mixins: [user],
  watch: {
    user(value) {
      if (value !== undefined && value !== null) {
        this.$router.push("/account");
      }
    }
  },
  methods: {
    googleSignIn() {
      this.$store.dispatch("GOOGLE_SIGN_IN");
      this.$router.push("/account");
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.login-container {
  display: block;
  width: 300px;
  height: 500px;
  padding: 25px;
  border-radius: 10px;
  background-color: #f3f3f3;
}
.google-btn {
  display: inline-flex;
  align-items: center;
  padding: 0px;
  margin-top: 25px;
  box-sizing: border-box;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  background-color: #4285f4;
  color: #fff;
  cursor: pointer;
}

.google-btn__text {
  margin: 0px 15px;
}
</style>
