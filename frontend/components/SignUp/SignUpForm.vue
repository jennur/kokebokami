<template>
  <form class="sign-up-form" v-on:submit.prevent>
    <label class="flex-column margin-bottom--medium">
      E-mail
      <input
        class="margin-top--small"
        id="email"
        type="email"
        autocomplete="email"
        v-model="email"
      />
      <span class="system-message margin-top--small">{{ emailError }}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      {{ $t("password") }}
      <input
        class="margin-top--small"
        id="password"
        type="password"
        autocomplete="new-password"
        v-model="password"
      />
      <span class="system-message margin-top--small">{{ passwordError }}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      {{ $t("signUp.repeatPassword") }}

      <input
        class="margin-top--small"
        id="password-repeated"
        type="password"
        autocomplete="new-password"
        v-model="passwordRepeat"
      />
      <span class="system-message margin-top--small">{{
        passwordRepeatError
      }}</span>
    </label>
    <label class="flex-column margin-bottom--medium">
      <span class="flex-row flex-row--nowrap">
        <input
          tabindex="0"
          class="margin-top--small"
          id="terms-and-conditions"
          type="checkbox"
          v-model="termsAndConditions"
        />
        <span class="sign-up-form_terms padding-horizontal--small">
          {{ $t("signUp.iAgreeTo") }}
          <nuxt-link :to="localePath('/terms-and-conditions/')"
            >Terms and Conditions</nuxt-link
          >
          {{ " &" }}
          <nuxt-link :to="localePath('/privacy-policy/')"
            >Privacy Policy</nuxt-link
          >
        </span>
      </span>
      <span class="system-message margin-top--small">{{
        termsAndConditionsError
      }}</span>
    </label>
    <div class="flex-column margin-top--small">
      <button @click="validateForm" class="button button--small button--green">
        {{ $t("signUpText") }}
      </button>
      <span class="system-message margin-top--small">{{ systemMessage }}</span>
    </div>
  </form>
</template>
<script>
export default {
  name: "sign-up-form",
  data() {
    return {
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      passwordRepeat: "",
      passwordRepeatError: "",
      termsAndConditions: false,
      termsAndConditionsError: ""
    };
  },
  computed: {
    systemMessage() {
      return this.$store.state.signupSystemMessage;
    }
  },
  methods: {
    signUp() {
      let credentials = { email: this.email, password: this.password };
      this.$fireAuth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(response => {
          response.user
            .sendEmailVerification()
            .then(() => {
              console.log("Verification email sent");
            })
            .catch(error => {
              console.log("Error sending verification email:", error.message);
            });
        })
        .catch(function(error) {
          commit("setSignupSystemMessage", error.message);
          console.log(
            "Failed with error code: " + error.code + " " + error.message
          );
        });
    },
    validateForm() {
      const emailRegex = /^\S+@\S+\.\S+$/;
      let validated = 1;

      if (!this.email.match(emailRegex)) {
        validated = validated * 0;
        this.emailError = "Please enter a valid email address";
      } else this.emailError = "";

      if (this.password.length < 6) {
        validated = validated * 0;
        this.passwordError = "Password needs to be at least 6 characters";
      } else this.passwordError = "";

      if (this.password !== this.passwordRepeat) {
        validated = validated * 0;
        this.passwordRepeatError = "Passwords do not match";
      } else this.passwordRepeatError = "";

      if (!this.termsAndConditions) {
        validated = validated * 0;
        this.termsAndConditionsError = "You need to check the terms of service";
      } else this.termsAndConditionsError = "";

      if (validated === 1) {
        this.signUp();
      }
    }
  }
};
</script>
