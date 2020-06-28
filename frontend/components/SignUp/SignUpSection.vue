<template>
  <section class="padding--xlarge">
    <div class="container container--center">
      <h2 v-if="bigHeadline" class="margin-top--xlarge">{{ headline }}</h2>
      <h3 v-else>{{ headline }}</h3>
    </div>
    <div class="flex-row flex-row--justify-center tablet-width margin--auto">
      <sign-in-with-provider
        class="flex-row__half sign-in-with-provider margin-top--xxlarge margin-right--xlarge"
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
    bigHeadline: {
      type: Boolean,
      default: false
    },
    headline: {
      type: String,
      default: null
    }
  }
};
</script>
