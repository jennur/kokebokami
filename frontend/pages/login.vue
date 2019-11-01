<template>
  <div class="container container--center margin--auto">
    <div class="flex-center-container margin--auto">
      <login-container class="flex-order--tablet-two" />
      <kokebokapen class="graphic graphic--kokebokapen flex-order--tablet-one" />
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/kokebokapen.svg";
import LoginContainer from "~/components/Login/LoginContainer.vue";

export default {
  name: "Login",
  components: {
    LoginContainer,
    kokebokapen
  }
};
</script>
