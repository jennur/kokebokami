<template>
  <div>
    <HeaderComponent />
    <main class="tablet-width margin-auto padding-h-lg">
      <slot></slot>
    </main>
    <FooterComponent />
    <scroll-button />
  </div>
</template>

<script setup lang="ts">
import ScrollButton from "~/components/ScrollButton.vue";
</script>
