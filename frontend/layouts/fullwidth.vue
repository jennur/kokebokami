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
  </div>
</template>
<script>
export default {
  name: "fullwidth"
};
</script>
