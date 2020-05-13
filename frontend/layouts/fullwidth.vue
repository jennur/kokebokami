<template>
  <div>
    <header-component />
    <div class="full-width margin--auto">
      <nuxt />
    </div>
    <footer-component />
    <cookie-consent v-if="!cookieAccepted" @cookieAccept="closeCookieConsent" />

    <script
      id="dsq-count-scr"
      src="//kokebokami.disqus.com/count.js"
      async
    ></script>
  </div>
</template>
<script>
import CookieConsent from "../components/CookieConsent.vue";
import cookieConsentLogic from "../mixins/cookieConsent.js";

export default {
  name: "fullwidth",
  components: {
    CookieConsent
  },
  mixins: [cookieConsentLogic]
};
</script>
