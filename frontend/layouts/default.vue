<template>
  <div>
    <navigation />
    <nuxt />
    <footer-component />
    <cookie-consent />
  </div>
</template>
<script>
import CookieConsent from "~/components/CookieConsent.vue";
export default {
  name: "default-layout",
  components: {
    CookieConsent
  }
};
</script>


