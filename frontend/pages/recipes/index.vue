<template>
  <div class="container">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  name: "recipes",
  head() {
    return {
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/recipes/"
        }
      ]
    };
  },
  components: {},
  computed: {}
};
</script>
