<template>
  <footer class="footer flex-center-container flex-center-container--column">
    <ul class="footer__nav">
      <li>
        <nuxt-link to="/about">About</nuxt-link>
      </li>
      <li>
        <b>Contact:</b>
        <a href="mailto:contact@kokebokami.com">contact@kokebokami.com</a>
      </li>
      <li>
        <nuxt-link to="/privacy-policy">Privacy policy</nuxt-link>
      </li>
    </ul>
    <p class="footer__copyright">© {{year}} Kokebokami</p>
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
