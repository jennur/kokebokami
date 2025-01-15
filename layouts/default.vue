<template>
  <div>
    <header-component />
    <main class="tablet-width margin-auto padding-h-lg">
      <NuxtPage />
    </main>
    <footer-component />
    <scroll-button />
  </div>
</template>

<script setup lang="ts">
import ScrollButton from "~/components/ScrollButton.vue";
</script>
