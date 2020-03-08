<template>
  <div class="container container--center">
    <div class="flex-center-container margin--auto">
      <login-container class="flex-order--tablet-two" />
      <kokebokapen class="illustration illustration--kokebokapen flex-order--tablet-one" />
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/kokebokapen.svg";
import LoginContainer from "~/components/Login/LoginContainer.vue";
import { user } from "~/mixins/getCurrentUser.js";

export default {
  name: "Login",
  components: {
    LoginContainer,
    kokebokapen
  }
};
</script>
