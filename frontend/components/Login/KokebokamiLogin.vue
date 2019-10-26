<template>
  <section :class="'kokebokami-login ' + (open ? 'kokebokami-login--open': '') ">
    <div class="kokebokami-login-modal">
      <button @click="() => this.$emit('toggle')" class="remove-icon kokebokami-login-modal--close"></button>
      <form class="kokebokami-login-modal-form" v-on:submit.prevent>
        <label>
          Username
          <input type="text" v-model="email" required />
        </label>
        <label>
          Password
          <input type="password" v-model="password" required />
        </label>
        <span class="system-message">{{systemMessage}}</span>
        <button class="button button--small button--green margin-top--large">Log in</button>
        <div class="system-message">{{systemMessage}}</div>
        <div class="kokebokami-login-modal-signup margin-top--large">
          Don't already have an account?
          <nuxt-link to="/sign-up">Sign up</nuxt-link>
        </div>
      </form>
    </div>
  </section>
</template>
<script>
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "kokebokami-login",
  data() {
    return { systemMessage: "", email: "", password: "" };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    kokebokamiSignIn() {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          console.log("RESPONSE SIGN IN::: " + JSON.stringify(response));
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
          console.log(
            "Sign in failed with error code: " +
              error.code +
              " " +
              error.message
          );
          this.systemMessage = e.message;
        });
    }
  }
};
</script>
