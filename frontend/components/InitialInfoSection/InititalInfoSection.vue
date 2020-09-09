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
        <strong>Store and manage</strong> all your recipes from your mind, your
        handwritten cookbook or the internet. Create and organize
        <strong>shopping lists</strong>. <strong>Share everything</strong> with
        your friends, the public - <strong>or keep it all to yourself</strong>.
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
