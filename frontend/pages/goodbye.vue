<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />

    <div class="flex-center-container flex-center-container--column">
      <h2 class="margin-bottom-lg">Goodbye</h2>
      <p>
        Your account was successfully deleted. You're welcome back at any time!
      </p>
      <nuxt-link :to="localePath('/')">Back to home page</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "goodbye",
  head() {
    return {
      title: `Goodbye | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/goodbye/"
        }
      ]
    };
  },
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        { name: "Goodbye" }
      ];
    }
  }
};
</script>
