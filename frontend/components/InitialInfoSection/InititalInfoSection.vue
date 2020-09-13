<template>
  <section class="initial-info-section container--orange">
    <div
      class="flex-center-container flex-center-container--column tablet-width padding--none margin--auto"
    >
      <h1 class="container--center padding-horizontal--large">
        {{ $t("introHeading") }}
      </h1>
      <p
        class="padding-horizontal--large color--blue mobile-width text-align--center"
      >
        {{ $t("introDescription") }}
      </p>
      <nuxt-link
        :to="localePath('/sign-up/')"
        class="button button--large padding-horizontal--xlarge margin-vertical--large"
        >{{ $t("introCTA") }} ➔</nuxt-link
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
