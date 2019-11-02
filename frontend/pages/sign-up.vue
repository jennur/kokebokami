<template>
  <div class="container container--center padding-horizontal--large margin--auto">
    <h2 class="heading--display-font">Sign up to start building your own cook book.</h2>
    <sign-up-section :darkBg="darkBg" />
  </div>
</template>

<script>
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

export default {
  name: "sign-up",
  components: {
    SignUpSection
  },
  props: {
    darkBg: {
      type: Boolean,
      default: false
    }
  }
};
</script>
