<template>
  <section>
    <div
      class="accordion"
      v-for="accordion in accordions"
      :key="accordion.title"
    ></div>
  </section>
</template>

<script setup>
const props = defineProps({
  accordions: {
    type: Array,
    default: () => [],
  },
});
</script>
