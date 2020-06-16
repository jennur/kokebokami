<template>
  <div class="container container--center">
    <div v-if="loading">
      <loading-splash />
    </div>
    <div v-else class="flex-center-container margin--auto">
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
  head() {
    return {
      title: `Login | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/login/"
        }
      ]
    };
  },
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
