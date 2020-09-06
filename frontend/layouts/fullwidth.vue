<template>
  <div>
    <header-component />
    <main class="full-width margin--auto">
      <nuxt />
    </main>
    <footer-component />
    <scroll-button />
  </div>
</template>
<script>
import ScrollButton from "~/components/ScrollButton.vue";

export default {
  name: "fullwidth",
  components: {
    ScrollButton
  }
};
</script>
