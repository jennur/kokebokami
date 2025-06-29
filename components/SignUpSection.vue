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
      <div>
      <p class="margin-bottom-xl">
        {{ $t("signUp.soMeLoginText") }}
      </p>
      <GoogleLogin class="margin-bottom-md" />
    </div>
    </div>
  </section>
</template>

<script setup>
import GoogleLogin from "~/components/Login/GoogleLogin.vue";

const props = defineProps({
  darkBg: {
    type: Boolean,
    default: false
  },
  signUpPage: {
    type: Boolean,
    default: false
  }
})
</script>
