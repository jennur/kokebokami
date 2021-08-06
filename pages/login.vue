<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />

    <div class="mobile-width flex-row flex-center-container flex-row--nowrap margin-auto">
      <kokebokapen class="illustration illustration--kokebokapen" />
      <login-container/>
    </div>
  </div>
</template>

<script>
import kokebokapen from "~/assets/graphics/illustrations/kokebokapen.svg";
import LoginContainer from "~/components/Login/LoginContainer.vue";

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
    LoginContainer,
    kokebokapen
  },
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: this.$t("loginText") }
      ];
    }
  }
};
</script>
