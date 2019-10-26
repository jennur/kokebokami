<template>
  <section :class="'kokebokami-login ' + (open ? 'kokebokami-login--open': '') ">
    <div class="kokebokami-login-modal">
      <button @click="() => this.$emit('toggle')" class="remove-icon kokebokami-login-modal--close"></button>
      <form class="kokebokami-login-modal-form" v-on:submit.prevent>
        <label>
          Username
          <input type="text" required />
        </label>
        <label>
          Password
          <input type="password" required />
        </label>

        <button type="submit" class="button button--small button--green margin-top--large">Log in</button>

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
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    kokebokamiSignIn() {
      this.$store.dispatch("KOKEBOKAMI_SIGN_IN");
    }
  }
};
</script>
