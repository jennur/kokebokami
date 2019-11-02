<template>
  <div class="container container--center padding-horizontal--large margin--auto">
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
