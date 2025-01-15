<template>
  <section class="loading-splash">
    <div class="container container--center mobile-width" v-show="loginError">
      <p class="system-message">{{ loginError }}</p>
      <NuxtLink :to="$localePath('/login/')">Try again</NuxtLink>
    </div>
    <div v-show="!loginError" class="flex-center-container">
      <span class="simple-loading-spinner"></span>
      <h2 class="margin-top-lg">Logging you in ...</h2>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '../../store';
const authStore = useAuthStore();

const loginError = computed(() => {
  const error = authStore.loginMessage;
  if (error.length) {
    console.log("Login error:", error.message);
    authStore.SET_LOGIN_MESSAGE("");
    return "We were not able to log you in. Please try again later or use a different provider.";
  }
  return "";
})
</script>
