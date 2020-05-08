<template>
  <div class="loading-splash">
    <div class="container container--center mobile-width" v-if="loginError">
      <p class="system-message">{{loginError}}</p>
      <nuxt-link to="/login">Try again</nuxt-link>
    </div>
    <h2 v-else>Logging you in ...</h2>
  </div>
</template>

<script>
export default {
  name: "loading-splash",
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
