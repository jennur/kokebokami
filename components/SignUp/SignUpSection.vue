<template>
  <section class="padding-xl">
    <div class="container container--center">
      <h2 class="margin-top-xl">
        {{
          signUpPage ? $t("signUp.headingSignUp") : $t("signUp.headingIndex")
        }}
      </h2>
    </div>
    <div class="sign-up-section">
      <sign-in-with-provider
        class="sign-in-with-provider margin-bottom-2xl"
      />
      <!-- <sign-up-form
        class="flex-row_half margin-top-2xl"
        :class="{
          'dark-bg': darkBg,
          'sign-up-form--green': !darkBg
        }"
      /> -->
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
