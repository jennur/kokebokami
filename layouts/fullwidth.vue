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

<script setup>
import ScrollButton from "~/components/ScrollButton.vue";
</script>
