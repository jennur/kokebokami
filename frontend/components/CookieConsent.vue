<template>
  <div
    :class="'cookie-consent-container ' + (cookieConsentAccepted || cookieInitialAccept ? 'cookie-consent--accepted': '')"
  >
    <p
      class="cookie-consent__text"
    >Kokebokami uses cookies to provide and improve the service. By using this website, you consent to cookies.</p>
    <div class="flex-row-container">
      <nuxt-link to="/cookies-policy">Learn more</nuxt-link>
      <button class="button button--small margin-left--large" @click="consent">Accept</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "cookie-consent",
  data() {
    return {
      cookieConsentAccepted: window.sessionStorage.cookieConsentAccepted,
      cookieInitialAccept: false
    };
  },

  methods: {
    consent() {
      window.sessionStorage.setItem("cookieConsentAccepted", true);
      this.cookieInitialAccept = true;
    }
  }
};
</script>
