<template>
  <div>
    <HeaderComponent />
    <main class="full-width margin-auto">
      <slot></slot>
    </main>
    <FooterComponent />
    <ScrollButton />
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
