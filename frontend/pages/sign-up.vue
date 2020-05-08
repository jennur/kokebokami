<template>
  <div class="container container--center">
    <h2>Sign up to start building your own cookbook.</h2>
    <sign-up-section :darkBg="darkBg" />
  </div>
</template>

<script>
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "sign-up",
  components: {
    SignUpSection
  },
  mixins: [user],
  props: {
    darkBg: {
      type: Boolean,
      default: false
    }
  }
};
</script>
