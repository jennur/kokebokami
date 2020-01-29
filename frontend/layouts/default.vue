<template>
  <div>
    <header-component />
    <div class="tablet-width margin--auto padding-horizontal--large">
      <nuxt />
    </div>
    <footer-component />
    <cookie-consent />
  </div>
</template>
<script>
import CookieConsent from "~/components/CookieConsent.vue";
export default {
  name: "default-layout",
  components: {
    CookieConsent
  }
};
</script>


