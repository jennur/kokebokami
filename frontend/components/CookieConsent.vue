<template>
  <section class="cookie-consent-container">
    <p class="cookie-consent_text margin-bottom-md">
      Kokebokami uses cookies to provide and improve the service. By using this
      website, you consent to cookies.
    </p>
    <div class="flex-row-container">
      <nuxt-link :to="localePath('/cookies-policy/')">Learn more</nuxt-link>
      <button
        class="button button--green-border button-sm margin-left-lg"
        @click="
          () => {
            this.$emit('cookieAccept');
          }
        "
      >
        Accept
      </button>
    </div>
  </section>
</template>
<script>
export default {
  name: "cookie-consent"
};
</script>
