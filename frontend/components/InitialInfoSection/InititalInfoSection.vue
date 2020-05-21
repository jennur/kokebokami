<template>
  <section class="container--orange">
    <div class="tablet-width margin--auto padding-horizontal--large">
      <div
        class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
      >
        <h1 class="padding-horizontal--large margin-top--xxlarge">
          Build your personal cookbook online!
        </h1>
        <p
          class="padding-horizontal--large color--blue font-size--medium text-align--center"
        >
          Start storing your personal recipes online to make sure they never get
          lost. Keep them private, share them with the public or your friends
          only.
        </p>
        <nuxt-link
          to="/sign-up"
          class="button button--large padding-horizontal--xlarge margin-top--large"
          >Get started ➔</nuxt-link
        >
      </div>
      <div class="flex-center-container"></div>
    </div>
    <client-only>
      <kokebokaMobile
        v-if="isMobile"
        class="illustration illustration--kokeboka"
      />
      <kokeboka v-else class="illustration illustration--kokeboka" />
    </client-only>
  </section>
</template>

<script>
import kokeboka from "~/assets/graphics/foodboard-wide.svg";
import kokebokaMobile from "~/assets/graphics/foodboard-mobile.svg";

export default {
  name: "initial-info-section",
  components: {
    kokeboka,
    kokebokaMobile
  },
  computed: {
    isMobile() {
      if (process.browser) return window.innerWidth < 600;
    }
  }
};
</script>
