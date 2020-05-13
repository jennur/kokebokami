<template>
  <div>
    <header-component />
    <div class="tablet-width margin--auto padding-horizontal--large">
      <nuxt />
    </div>
    <footer-component />
    <cookie-consent v-if="!cookieAccepted" @cookieAccept="closeCookieConsent" />
  </div>
</template>
<script>
import CookieConsent from "~/components/CookieConsent.vue";
import cookieConsentLogic from "../mixins/cookieConsent.js";

export default {
  name: "default-layout",
  components: {
    CookieConsent
  },
  mixins: [cookieConsentLogic]
};
</script>
