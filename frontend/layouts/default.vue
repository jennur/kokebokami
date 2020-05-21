<template>
  <div>
    <header-component />
    <main class="tablet-width margin--auto padding-horizontal--large">
      <nuxt />
    </main>
    <footer-component />
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
