<template>
  <div class="container container--center margin--auto">
    <h2>Sign up to start building your own cook book</h2>
    <sign-up-form />
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
