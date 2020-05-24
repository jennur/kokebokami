<template>
  <div class="container container--center">
    <loading-splash v-show="loading" />
    <div v-show="!loading" class="flex-center-container margin--auto">
      <login-container class="flex-order--tablet-two" />
      <kokebokapen
        class="illustration illustration--kokebokapen flex-order--tablet-one"
      />
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/kokebokapen.svg";
import LoadingSplash from "~/components/Login/LoadingSplash.vue";
import LoginContainer from "~/components/Login/LoginContainer.vue";
import user from "~/mixins/user.js";

export default {
  name: "Login",
  components: {
    LoadingSplash,
    LoginContainer,
    kokebokapen
  },
  computed: {
    loading() {
      return this.$route.fullPath.indexOf("loading") > -1;
    }
  }
};
</script>
