<template>
  <div class="container">
    <nuxt-child />
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: "canonical",
      href: "https://kokebokami.com/recipes/",
    },
  ],
});
</script>
