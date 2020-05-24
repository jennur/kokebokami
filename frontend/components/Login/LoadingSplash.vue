<template>
  <section class="loading-splash">
    <div class="container container--center mobile-width" v-if="loginError">
      <span class="system-message">{{ loginError }}</span>
      <nuxt-link to="/login/">Try again</nuxt-link>
    </div>
    <div v-else>
      <loadingBook />
      <h2>Logging you in ...</h2>
    </div>
  </section>
</template>

<script>
import loadingBook from "~/assets/graphics/loading-book.svg";
export default {
  name: "loading-splash",
  components: {
    loadingBook
  },
  computed: {
    loginError() {
      let error = this.$store.state.loginSystemMessage;
      if (error.length) {
        this.$store.dispatch("SET_LOGIN_MESSAGE", "");
        return "We were not able to log you in. Please try again later or use a different provider.";
      }
    }
  }
};
</script>
