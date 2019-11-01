<template>
  <div class="container container--center padding-horizontal--large margin--auto">
    <div class="mobile-width border-box border-box--rounded margin--auto">
      <h3
        class="heading--display-font margin-bottom--xxlarge"
      >Sign up to start building your own cook book</h3>
      <sign-up-form />
    </div>
  </div>
</template>

<script>
import SignUpForm from "~/components/SignUpForm.vue";

export default {
  name: "sign-up",
  components: {
    SignUpForm
  }
};
</script>
