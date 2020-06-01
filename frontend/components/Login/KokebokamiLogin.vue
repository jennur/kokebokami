<template>
  <section :class="'kokebokami-login ' + (open ? 'kokebokami-login--open' : '')">
    <transition name="pop-modal">
      <div v-if="open" class="kokebokami-login-modal">
        <button
          @click="() => this.$emit('toggle')"
          class="remove-icon kokebokami-login-modal--close"
        ></button>
        <form class="kokebokami-login-modal-form" v-on:submit.prevent>
          <fieldset>
            <label>
              E-mail
              <input type="text" autocomplete="email" v-model="email" required />
            </label>
            <label>
              Password
              <input type="password" autocomplete="password" v-model="password" required />
            </label>
          </fieldset>
          <button
            @click="kokebokamiSignIn"
            class="button button--small button--green margin-top--large"
          >Log in</button>
          <div class="system-message system-message--dark-bg margin-top--medium">{{ systemMessage }}</div>
          <div class="kokebokami-login-modal-signup margin-top--large">
            Don't already have an account?
            <nuxt-link to="/sign-up/">Sign up</nuxt-link>
          </div>
        </form>
      </div>
    </transition>
  </section>
</template>
<script>
import user from "~/mixins/user.js";

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
      const componentThis = this;
      try {
        this.$router.push("/login?loading");
        this.$fireAuth
          .signInWithEmailAndPassword(this.email, this.password)
          .catch(error => {
            this.$store.dispatch("SET_LOGIN_MESSAGE", error.message);
          });
        console.log("Logging in with firebase");
      } catch (error) {
        console.log("Error signing in:", error);
        this.$store.dispatch("SET_LOGIN_MESSAGE", error.message);
      }
    }
  }
};
</script>
