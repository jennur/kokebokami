<template>
  <div>
    <header-component class="margin--none"/>
    <div class="container--dark">
      <main class="tablet-width margin-auto padding-h-lg">
        <nuxt />
      </main>
    </div>
    <footer-component />
    <scroll-button />
  </div>
</template>
<script>
import ScrollButton from "~/components/ScrollButton.vue";

export default {
  name: "dark-default",
  components: {
    ScrollButton
  }
};
</script>
