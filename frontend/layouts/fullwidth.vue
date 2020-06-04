<template>
  <div>
    <header-component />
    <main class="full-width margin--auto">
      <nuxt />
    </main>
    <footer-component />
    <script
      id="dsq-count-scr"
      src="//kokebokami.disqus.com/count.js"
      async
    ></script>
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
