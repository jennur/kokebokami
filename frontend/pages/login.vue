<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />

    <div v-if="loading">
      <loading-splash />
    </div>
    <div
      v-else
      class="flex-row flex-row--justify-center flex-row--align-center flex-row--nowrap margin--auto"
    >
      <kokebokapen class="illustration illustration--kokebokapen" />
      <login-container />
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
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [{ name: "Home", link: "/" }, { name: "Login" }]
    }
  },
  computed: {
    loading() {
      return this.$route.fullPath.indexOf("loading") > -1;
    }
  }
};
</script>
