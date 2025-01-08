<template>
  <footer class="footer">
    <div class="footer_columns">
      <ul class="footer_nav margin-lg">
        <li>
          <h4 class="color--blue">
            {{ $t("navigation.footer.languageHeading") }}
          </h4>
        </li>
        <language-navigation />
      </ul>

      <shortcuts />

      <ul class="footer_nav margin-lg">
        <li>
          <h4 class="color--blue">
            {{ $t("navigation.footer.aboutHeading") }}
          </h4>
        </li>
        <li>
          <nuxt-link :to="localePath('/about/')">{{
            $t("navigation.footer.aboutText")
          }}</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="localePath('/privacy-policy/')"
            >Privacy policy</nuxt-link
          >
        </li>
        <li>
          <nuxt-link :to="localePath('/cookies-policy/')"
            >Cookies policy</nuxt-link
          >
        </li>
      </ul>
    </div>
    <p class="footer_copyright">© {{ year }} Kokebokami</p>
  </footer>
</template>
<script>
import LanguageNavigation from "../LanguageNavigation.vue";
import Shortcuts from "./Shortcuts.vue";
import user from "~/mixins/user.js";

export default {
  name: "footer-component",
  components: {
    LanguageNavigation,
    Shortcuts
  },
  mixins: [user],
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>
