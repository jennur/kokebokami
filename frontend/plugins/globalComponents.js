import Vue from "vue";
import Header from "~/components/Header/Header.vue";
import BreadCrumbs from "~/components/Header/Navigation/BreadCrumbs.vue";
import Footer from "~/components/Footer.vue";
import CookieConsent from "~/components/CookieConsent.vue";
import RightArrow from "~/assets/graphics/rightarrow.svg";
import ShareIcon from "~/assets/graphics/shareicon.svg";
import DownloadIcon from "~/assets/graphics/downloadicon.svg";
import SearchIcon from "~/assets/graphics/searchicon.svg";

Vue.component("header-component", Header);
Vue.component("breadcrumbs", BreadCrumbs);
Vue.component("footer-component", Footer);
Vue.component("cookie-consent", CookieConsent);

/* Icons */

Vue.component("right-arrow", RightArrow);
Vue.component("share-icon", ShareIcon);
Vue.component("download-icon", DownloadIcon);
Vue.component("search-icon", SearchIcon);
