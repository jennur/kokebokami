<template>
  <modal-box :open="open" @close="closeModal" class="kokebokami-login">
    <h3>{{$t('loginWith')}} Kokebokami</h3>

    <form class="kokebokami-login-form" v-on:submit.prevent>
      <fieldset>
        <div v-if="resettingPassword" class="margin-bottom-lg">
          {{ $t("login.newPasswordText") }}
        </div>

        <label>
          {{ $t("email") }}
          <input type="text" autocomplete="email" v-model="email" required />
        </label>

        <label v-if="!resettingPassword">
          {{ $t("password") }}
          <input type="password" autocomplete="password" v-model="password" required/>
        </label>
      </fieldset>

      <expand-transition :show="!!loginSystemMessage">
        <div class="system-message system-message--dark-bg margin-top-lg">
          {{ loginSystemMessage }}
        </div>
      </expand-transition>

      <button v-if="!resettingPassword" @click="kokebokamiSignIn" class="button button-sm button--green margin-top-lg">
        <span v-if="loggingIn" class="simple-loading-spinner"></span>
        <span v-else>{{ $t("loginText") }}</span>
      </button>

      <button v-else @click="handlePasswordReset" class="button button-sm button--green margin-top-lg">
        Send
      </button>

      <expand-transition :show="!!resetEmailMessage">
        <div class="system-message system-message--dark-bg margin-top-lg">
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
        <div v-if="!resettingPassword" class="link color--green margin-top-lg" @click="openPasswordReset">
          {{ $t("login.forgottenPassword") }}
        </div>
      </expand-transition>

      <div class="kokebokami-login-signup margin-top-lg">
        {{ $t("login.noAccount") }}?
        <nuxt-link :to="localePath('/sign-up/')">
          {{$t("signUpText") }}
        </nuxt-link>
      </div>
    </form>
  </modal-box>
</template>
<script>
import ExpandTransition from "~/components/Transitions/Expand.vue";
import ModalBox from "~/components/ModalBox";

export default {
  name: "kokebokami-login",
  components: {
    ModalBox,
    ExpandTransition
  },
  data() {
    return {
      loginSystemMessage: "",
      resetEmailMessage: "",
      email: "",
      password: "",
      resettingPassword: false,
      successReset: false,
      loggingIn: false
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
      this.$fire.auth
        .sendPasswordResetEmail(email)
        .then(() => {
          // Email sent.
          this.resetEmailMessage = "A reset link was sent to your email.";
          console.log("Email sent");
          this.successReset = true;
        })
        .catch((error) => {
          // An error happened.
          this.resetEmailMessage = error.message;
          console.log("Error", error.message);
        });
    },
    kokebokamiSignIn() {
      this.loggingIn = true;
      try {
        this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            console.log("Logging in with firebase");
            this.loggingIn = false;
            this.$store.dispatch('SHOW_LOGIN_MODAL', {open: false, headline: null})
            this.$emit("logged-in");
          })
          .catch(error => {
            this.loginSystemMessage = error.message;
            this.loggingIn = false;
          });
      } catch (error) {
        console.log("Error signing in:", error.message);
      }
    }
  }
};
</script>
