<template>
  <section class="padding--xlarge">
    <div class="container container--center">
      <h2 class="margin-top--xlarge">
        {{
          signUpPage ? $t("signUp.headingSignUp") : $t("signUp.headingIndex")
        }}
      </h2>
    </div>
    <div class="sign-up-section">
      <sign-in-with-provider
        class="flex-row__half sign-in-with-provider margin-top--xxlarge"
      />
      <sign-up-form
        class="flex-row__half margin-top--xxlarge"
        :class="{
          'dark-bg': darkBg,
          'sign-up-form--green': !darkBg
        }"
      />
    </div>
  </section>
</template>

<script>
import SignUpForm from "./SignUpForm.vue";
import SignInWithProvider from "./SignInWithProvider.vue";

export default {
  name: "sign-up-section",
  components: {
    SignUpForm,
    SignInWithProvider
  },
  props: {
    darkBg: {
      type: Boolean,
      default: false
    },
    signUpPage: {
      type: Boolean,
      default: false
    }
  }
};
</script>
