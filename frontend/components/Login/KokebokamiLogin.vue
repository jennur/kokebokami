<template>
  <section :class="'kokebokami-login ' + (open ? 'kokebokami-login--open': '') ">
    <div class="kokebokami-login-modal">
      <button @click="() => this.$emit('toggle')" class="remove-icon kokebokami-login-modal--close"></button>
      <form class="kokebokami-login-modal-form" v-on:submit.prevent>
        <label>
          Username (e-mail)
          <input type="text" v-model="email" required />
        </label>
        <label>
          Password
          <input type="password" v-model="password" required />
        </label>
        <button
          @click="kokebokamiSignIn"
          class="button button--small button--green margin-top--large"
        >Log in</button>
        <div class="system-message system-message--dark-bg margin-top--medium">{{systemMessage}}</div>
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
import { auth, db } from "~/plugins/firebase.js";

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
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(response => {
          var displayName = "";
          console.log("RESPONSE. ENTERING DB::: ");

          if (response.user !== null) {
            db.ref("users/" + response.user.uid).on("value", snapshot => {
              displayName = snapshot.val().displayName;
              let user = {
                id: response.user.uid,
                name: displayName
              };
              realThis.$store.dispatch("SET_USER", user);
            });
          }
        })
        .catch(error => {
          console.log(
            "Sign in failed with error code: " +
              error.code +
              " " +
              error.message
          );
          realThis.systemMessage = error.message;
        });
    }
  }
};
</script>
