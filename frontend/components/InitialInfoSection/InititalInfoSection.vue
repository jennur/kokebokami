<template>
  <section class="initial-info-section container--orange">
    <div
      class="flex-center-container flex-center-container--column tablet-width padding--none margin--auto"
    >
      <h1 class="container--center padding-horizontal--large">Build your personal cookbook online</h1>
      <p class="padding-horizontal--large color--blue mobile-width text-align--center">
        Store your personal recipes online to make sure they don't get lost. Keep them private, share them with the public or your friends
        only.
      </p>
      <nuxt-link
        to="/sign-up/"
        class="button button--large padding-horizontal--xlarge margin-top--large"
      >Get started ➔</nuxt-link>
    </div>
    <client-only>
      <component
        :is="kokebokamiIllustration"
        class="illustration illustration--kokeboka margin-top--xxlarge"
      />
    </client-only>
    <anchor-button :scrollTo="nextSection" />
  </section>
</template>

<script>
import kokeboka from "~/assets/graphics/illustrations/foodboard.svg";
import kokebokaMobile from "~/assets/graphics/illustrations/foodboard-mobile.svg";
import AnchorButton from "~/components/AnchorButton.vue";

export default {
  name: "initial-info-section",
  components: {
    kokeboka,
    kokebokaMobile,
    AnchorButton
  },
  props: {
    nextSection: {
      type: String,
      default: ""
    }
  },
  computed: {
    isMobile() {
      if (process.browser) return window.innerWidth < 600;
    },
    kokebokamiIllustration() {
      return this.isMobile ? "kokebokaMobile" : "kokeboka";
    }
  }
};
</script>
