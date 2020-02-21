<template>
  <section class="tablet-width margin--auto padding-horizontal--large margin-top--xxlarge">
    <div
      class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
    >
      <h1 class="padding-horizontal--large">It's time to digitalize your cook book!</h1>
      <p class="padding-horizontal--large color--blue font-size--medium text-align--center">
        Start storing your personal recipes online to make sure they never get
        lost. Keep them private, share them with the public or your friends
        only.
      </p>
      <nuxt-link
        to="/sign-up"
        class="button button--large padding-horizontal--xlarge margin-top--large"
      >Get started ➔</nuxt-link>
    </div>
    <div class="flex-center-container">
      <kokeboka class="illustration illustration--kokeboka" />
    </div>
  </section>
</template>

<script>
import kokeboka from "~/assets/graphics/veggies.svg";

export default {
  name: "initial-info-section",
  components: {
    kokeboka
  }
};
</script>
