<template>
  <footer class="footer flex-center-container flex-center-container--column">
    <div class="flex-row flex-row--align-top">
      <ul class="footer__nav margin--large">
        <li>
          <h4 class="color--blue">Contact</h4>
        </li>
        <li>
          <a href="https://www.facebook.com/kokebokami" class="social-media">
            <fa :icon="['fab', 'facebook-square']" style="font-size: 25px; margin-right: 10px;" />
            <span class="social-media__text">Like us on Facebook</span>
          </a>
        </li>
        <li>
          <a href="mailto:contact@kokebokami.com">contact@kokebokami.com</a>
        </li>
      </ul>

      <ul class="footer__nav margin--large">
        <li>
          <h4 class="color--blue">About</h4>
        </li>
        <li>
          <nuxt-link to="/about/">What is Kokebokami</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/privacy-policy/">Privacy policy</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cookies-policy/">Cookies policy</nuxt-link>
        </li>
      </ul>

      <ul v-if="!user" class="footer__nav margin--large">
        <li>
          <h4 class="color--blue">Shortcuts</h4>
        </li>
        <li>
          <nuxt-link to="/login/">Login</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/sign-up/">Sign up</nuxt-link>
        </li>
      </ul>
    </div>
    <p class="footer__copyright">© {{ year }} Kokebokami</p>
  </footer>
</template>
<script>
import user from "~/mixins/user.js";
export default {
  name: "footer-component",
  mixins: [user],
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>
