<template>
  <section class="loading-splash">
    <div class="container container--center mobile-width" v-show="loginError">
      <p class="system-message">{{ loginError }}</p>
      <nuxt-link :to="localePath('/login/')">Try again</nuxt-link>
    </div>
    <div v-show="!loginError" class="flex-center-container">
      <span class="simple-loading-spinner"/>
      <h2 class="margin-top-lg">Logging you in ...</h2>
    </div>
  </section>
</template>

<script>
import loadingBook from "~/assets/graphics/illustrations/loading-book.svg";
export default {
  name: "loading-splash",
  components: {
    loadingBook
  },
  computed: {
    loginError() {
      let error = this.$store.state.loginSystemMessage;
      if (error.length) {
        console.log("Login error:", error.message);
        this.$store.dispatch("SET_LOGIN_MESSAGE", "");
        return "We were not able to log you in. Please try again later or use a different provider.";
      }
      return "";
    }
  }
};
</script>
