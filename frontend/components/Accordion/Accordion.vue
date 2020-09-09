<template>
  <section>
    <div
      class="accordion"
      v-for="accordion in accordions"
      :key="accordion.title"
    ></div>
  </section>
</template>

<script>
export default {
  name: "accordion",
  props: {
    accordions: {
      type: Array,
      default: () => []
    }
  }
};
</script>
