<template>
  <nuxt-link class="gateway-link" :to="gateway.link" :key="gateway.title">
    <component v-if="illustration" :is="illustration" class="gateway-link--illustration" />
    <h3 v-if="gateway.title" class="margin-top-lg">{{ gateway.title }}</h3>
    <p v-if="gateway.description">{{ gateway.description }}</p>
  </nuxt-link>
</template>
<script>
export default {
  name: "gateway-link",
  props: {
    gateway: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      illustration: null
    };
  },
  created() {
    if (this.gateway.graphic) {
      this.illustration = () =>
        import(
          `../assets/graphics/illustrations/${this.gateway.graphic.name}.svg`
        );
    }
  }
};
</script>
