<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />

    <div v-if="loading">
      <loading-splash />
    </div>
    <div
      v-else
      class="mobile-width flex-row flex-center-container flex-row--nowrap margin-auto"
    >
      <kokebokapen class="illustration illustration--kokebokapen" />
      <login-container/>
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/illustrations/kokebokapen.svg";
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
          href: "https://kokebokami.com/login/"
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
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("loginText") }
      ];
    },
    loading() {
      return this.$route.fullPath.indexOf("?loading") > -1;
    }
  }
};
</script>
