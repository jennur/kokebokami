import Vue from "vue";
import Header from "~/components/Header/Header.vue";
import BreadCrumbs from "~/components/Header/Navigation/BreadCrumbs.vue";
import Footer from "~/components/Footer.vue";
import CookieConsent from "~/components/CookieConsent.vue";
import RightArrow from "~/assets/graphics/icons/rightarrow.svg";
import ShareIcon from "~/assets/graphics/icons/shareicon.svg";
import DownloadIcon from "~/assets/graphics/icons/downloadicon.svg";
import SearchIcon from "~/assets/graphics/icons/searchicon.svg";
import EditIcon from "~/assets/graphics/icons/edit-icon.svg";
import DeleteIcon from "~/assets/graphics/icons/delete-icon.svg";
import SettingsIcon from "~/assets/graphics/icons/settings-icon.svg";
import DownArrow from "~/assets/graphics/icons/down-arrow.svg";

Vue.component("header-component", Header);
Vue.component("breadcrumbs", BreadCrumbs);
Vue.component("footer-component", Footer);
Vue.component("cookie-consent", CookieConsent);

/* Icons */

Vue.component("right-arrow", RightArrow);
Vue.component("down-arrow", DownArrow);
Vue.component("share-icon", ShareIcon);
Vue.component("download-icon", DownloadIcon);
Vue.component("search-icon", SearchIcon);
Vue.component("edit-icon", EditIcon);
Vue.component("delete-icon", DeleteIcon);
Vue.component("settings-icon", SettingsIcon);
