<template>
  <section
    :class="'kokebokami-login ' + (open ? 'kokebokami-login--open' : '')"
  >
    <div class="kokebokami-login-modal">
      <button
        @click="() => this.$emit('toggle')"
        class="remove-icon kokebokami-login-modal--close"
      ></button>
      <form class="kokebokami-login-modal-form" v-on:submit.prevent>
        <label>
          E-mail
          <input type="text" autocomplete="email" v-model="email" required />
        </label>
        <label>
          Password
          <input
            type="password"
            autocomplete="password"
            v-model="password"
            required
          />
        </label>
        <button
          @click="kokebokamiSignIn"
          class="button button--small button--green margin-top--large"
        >
          Log in
        </button>
        <div class="system-message system-message--dark-bg margin-top--medium">
          {{ systemMessage }}
        </div>
        <div class="kokebokami-login-modal-signup margin-top--large">
          Don't already have an account?
          <nuxt-link to="/sign-up">Sign up</nuxt-link>
        </div>
      </form>
    </div>
  </section>
</template>
<script>
import user from "~/mixins/user.js";
//import { auth, db } from "~/plugins/firebase.js";

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
      const realThis = this;
      this.$fireAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(response => {
          if (response.user !== null) {
            this.$fireDb
              .ref("users/" + response.user.uid)
              .on("value", snapshot => {
                let user = {
                  id: response.user.uid,
                  displayName: snapshot.val().displayName
                };
                realThis.$store.dispatch("SET_USER", user);
              });
          }
        })
        .catch(error => {
          console.log("Error signing in:", error);
          realThis.systemMessage = "Email and password do not match";
        });
    }
  }
};
</script>
