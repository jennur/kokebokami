<template>
  <section class="initial-info-section container--orange">
    <div
      class="flex-center-container flex-center-container--column tablet-width padding--none margin--auto"
    >
      <h1 class="container--center padding-horizontal--large">
        Build your personal cookbook online
      </h1>
      <p
        class="padding-horizontal--large color--blue mobile-width text-align--center"
      >
        Store and manage all your recipes,reate and organize shopping lists.
        Share everything with your friends, the public - or keep it all to
        yourself.
      </p>
      <nuxt-link
        to="/sign-up/"
        class="button button--large padding-horizontal--xlarge margin-vertical--large"
        >Get started ➔</nuxt-link
      >
    </div>
  </section>
</template>

<script>
export default {
  name: "initial-info-section",
  props: {
    nextSection: {
      type: String,
      default: ""
    }
  },
  computed: {}
};
</script>
