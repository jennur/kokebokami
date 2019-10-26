<template>
  <div class="container container--center margin--auto">
    <h2>Log in to see kokeboka di</h2>

    <div class="flex-center-container flex-center-container--tablet-width margin--auto">
      <login-container class="flex-order--tablet-two" />

      <kokebokapen class="graphic graphic--kokebokapen flex-order--tablet-one" />
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/kokebokapen.svg";
import LoginContainer from "~/components/LoginContainer.vue";

export default {
  name: "Login",
  components: {
    LoginContainer,
    kokebokapen
  }
};
</script>
