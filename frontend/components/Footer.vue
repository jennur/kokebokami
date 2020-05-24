<template>
  <footer class="footer flex-center-container flex-center-container--column">
    <div class="flex-row margin-top--large">
      <ul class="footer__nav margin-horizontal--large">
        <li>
          <a
            href="https://www.facebook.com/kokebokami"
            class="flex-row flex-row--align-center"
          >
            <fa
              :icon="['fab', 'facebook-square']"
              style="font-size: 25px; margin-right: 10px;"
            />
            Follow us on Facebook
          </a>
        </li>
        <li>
          <b>Contact:</b>
          <a href="mailto:contact@kokebokami.com">contact@kokebokami.com</a>
        </li>
      </ul>
      <ul class="footer__nav margin-horizontal--large">
        <li>
          <nuxt-link to="/about/">About</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/privacy-policy/">Privacy policy</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/cookies-policy/">Cookies policy</nuxt-link>
        </li>
      </ul>
    </div>
    <p class="footer__copyright">© {{ year }} Kokebokami</p>
  </footer>
</template>
<script>
export default {
  name: "footer-component",
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>
