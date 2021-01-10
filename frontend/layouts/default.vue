<template>
  <div>
    <header-component />
    <main class="tablet-width margin-auto padding-horizontal-lg">
      <nuxt />
    </main>
    <footer-component />
    <scroll-button />
  </div>
</template>
<script>
import ScrollButton from "~/components/ScrollButton.vue";

export default {
  name: "default-layout",
  components: {
    ScrollButton
  }
};
</script>
