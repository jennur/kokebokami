import Vue from "vue";
import Navigation from "~/components/Navigation/Navigation.vue";
import BreadCrumbs from "~/components/Navigation/BreadCrumbs.vue";
import Footer from "~/components/Footer.vue";
import CookieConsent from "~/components/CookieConsent.vue";

Vue.component("navigation", Navigation);
Vue.component("breadcrumbs", BreadCrumbs);
Vue.component("footer-component", Footer);
Vue.component("cookie-consent", CookieConsent);
