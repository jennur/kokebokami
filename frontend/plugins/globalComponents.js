import Vue from "vue";
import Navigation from "~/components/Navigation/Navigation.vue";
import Footer from "~/components/Footer.vue";
import CookieConsent from "~/components/CookieConsent.vue";

Vue.component("navigation", Navigation);
Vue.component("footer-component", Footer);
Vue.component("cookie-consent", CookieConsent);
