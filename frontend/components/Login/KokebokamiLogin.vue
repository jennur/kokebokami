<template>
  <section
    :class="'kokebokami-login ' + (open ? 'kokebokami-login--open' : '')"
  >
    <transition name="pop-modal">
      <div v-if="open" class="kokebokami-login-modal margin-horizontal--medium">
        <button
          @click="closeModal"
          class="remove-icon kokebokami-login-modal--close"
        ></button>
        <h3>Log in with Kokebokami</h3>
        <form class="kokebokami-login-modal-form" v-on:submit.prevent>
          <fieldset>
            <div v-if="resettingPassword" class="margin-bottom--large">
              {{ $t("login.newPasswordText") }}
            </div>
            <label>
              {{ $t("email") }}
              <input
                type="text"
                autocomplete="email"
                v-model="email"
                required
              />
            </label>
            <label v-if="!resettingPassword">
              {{ $t("password") }}
              <input
                type="password"
                autocomplete="password"
                v-model="password"
                required
              />
            </label>
          </fieldset>
          <expand-transition :show="!!loginSystemMessage">
            <div
              class="system-message system-message--dark-bg margin-top--large"
            >
              {{ loginSystemMessage }}
            </div>
          </expand-transition>
          <button
            v-if="!resettingPassword"
            @click="kokebokamiSignIn"
            class="button button--small button--green margin-top--large"
          >
            {{ $t("loginText") }}
          </button>
          <button
            v-else
            @click="handlePasswordReset"
            class="button button--small button--green margin-top--large"
          >
            Send
          </button>
          <expand-transition :show="!!resetEmailMessage">
            <div
              class="system-message system-message--dark-bg margin-top--large"
            >
              {{ resetEmailMessage }}
              <span
                v-if="successReset"
                class="link--orange-underline"
                @click="closePasswordReset"
                >{{ $t("login.withNewPassword") }}</span
              >
            </div>
          </expand-transition>
          <expand-transition :show="!resettingPassword">
            <div
              v-if="!resettingPassword"
              class="link color--green margin-top--large"
              @click="openPasswordReset"
            >
              {{ $t("login.forgottenPassword") }}
            </div>
          </expand-transition>
          <div class="kokebokami-login-modal-signup margin-top--large">
            {{ $t("login.noAccount") }}?
            <nuxt-link :to="localePath('/sign-up/')">{{
              $t("signUpText")
            }}</nuxt-link>
          </div>
        </form>
      </div>
    </transition>
  </section>
</template>
<script>
import user from "~/mixins/user.js";
import ExpandTransition from "~/components/Transitions/Expand.vue";
export default {
  name: "kokebokami-login",
  components: {
    ExpandTransition
  },
  data() {
    return {
      loginSystemMessage: "",
      resetEmailMessage: "",
      email: "",
      password: "",
      resettingPassword: false,
      successReset: false
    };
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.resettingPassword = false;
      this.$emit("toggle");
      this.resetEmailMessage = "";
      this.loginSystemMessage = "";
    },
    openPasswordReset() {
      this.resettingPassword = true;
      this.resetEmailMessage = "";
    },
    closePasswordReset() {
      this.resettingPassword = false;
      this.resetEmailMessage = "";
    },
    handlePasswordReset() {
      let email = this.email;
      var componentThis = this;
      this.$fire.auth
        .sendPasswordResetEmail(email)
        .then(function() {
          // Email sent.
          componentThis.resetEmailMessage =
            "A reset link was sent to your email.";
          console.log("Email sent");
          componentThis.successReset = true;
        })
        .catch(function(error) {
          // An error happened.
          componentThis.resetEmailMessage = error.message;
          console.log("Error", error.message);
        });
    },
    kokebokamiSignIn() {
      const componentThis = this;
      try {
        this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => console.log("Logging in with firebase"))
          .catch(error => {
            componentThis.loginSystemMessage = error.message;
          });
      } catch (error) {
        console.log("Error signing in:", error.message);
      }
    }
  }
};
</script>
