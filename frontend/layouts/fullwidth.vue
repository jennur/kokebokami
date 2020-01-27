<template>
  <div>
    <navigation />
    <div class="full-width margin--auto">
      <nuxt />
    </div>
    <footer-component />
    <cookie-consent />
    <script id="dsq-count-scr" src="//kokebokami.disqus.com/count.js" async></script>
  </div>
</template>
<script>
import CookieConsent from "~/components/CookieConsent.vue";
export default {
  name: "fullwidth",
  components: {
    CookieConsent
  }
};
</script>
