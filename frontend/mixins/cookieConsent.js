export default {
  data() {
    return {
      cookieAccepted:
        process.browser &&
        window.sessionStorage.getItem("cookieConsentAccepted")
    };
  },
  methods: {
    closeCookieConsent() {
      if (process.browser) {
        window.sessionStorage.setItem("cookieConsentAccepted", true);
        this.cookieInitialAccept = true;
        this.cookieAccepted = true;
      }
    }
  }
};
