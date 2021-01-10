<template>
  <form class="sign-up-form" v-on:submit.prevent>
    <label class="flex-column margin-bottom-md">
      {{ $t("email") }}
      <input
        class="margin-top-sm"
        id="email"
        type="email"
        autocomplete="email"
        v-model="email"
      />
      <span class="system-message margin-top-sm">{{ emailError }}</span>
    </label>
    <label class="flex-column margin-bottom-md">
      {{ $t("password") }}
      <input
        class="margin-top-sm"
        id="password"
        type="password"
        autocomplete="new-password"
        v-model="password"
      />
      <span class="system-message margin-top-sm">{{ passwordError }}</span>
    </label>
    <label class="flex-column margin-bottom-md">
      {{ $t("signUp.repeatPassword") }}

      <input
        class="margin-top-sm"
        id="password-repeated"
        type="password"
        autocomplete="new-password"
        v-model="passwordRepeat"
      />
      <span class="system-message margin-top-sm">{{
        passwordRepeatError
      }}</span>
    </label>

    <label class="flex-column margin-bottom-md">
      <span class="flex-row flex-row--nowrap">
        <input
          tabindex="0"
          class="margin-top-sm"
          id="terms-and-conditions"
          type="checkbox"
          v-model="termsAndConditions"
        />
        <span class="sign-up-form_terms padding-horizontal-sm">
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
      <span class="system-message margin-top-sm">{{
        termsAndConditionsError
      }}</span>
    </label>
    <div class="flex-column margin-top-sm">
      <button @click="validateForm" class="button button-sm button--green">
        {{ $t("signUpText") }}
      </button>
      <span class="system-message margin-top-sm">{{ systemMessage }}</span>
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
      termsAndConditionsError: "",
      systemMessage: ""
    };
  },
  methods: {
    signUp() {
      this.$fire.auth
        .createUserWithEmailAndPassword(this.email, this.password)
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
        .catch((error) => {
          this.systemMessage = error.message;
          console.log(
            "Failed with error code: " + error.code + " " + error.message
          );
        });
    },
    async validateForm() {
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
