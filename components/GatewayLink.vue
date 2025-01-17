<template>
  <NuxtLink class="gateway-link" :to="gateway.link" :key="gateway.title">
    <component v-if="illustration" :is="illustration" class="gateway-link--illustration" />
    <h3 v-if="gateway.title" class="margin-top-lg">{{ gateway.title }}</h3>
    <p v-if="gateway.description">{{ gateway.description }}</p>
  </NuxtLink>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  gateway: {
    type: Object,
    default: () => {}
  }
})

const illustration = ref(null);

onMounted(async () => {
  if (props.gateway?.graphic?.name) {
    try {
      const svgModule = await import(
        `../assets/graphics/illustrations/${props.gateway.graphic.name}.svg`
      );
      illustration.value = markRaw(svgModule.default);
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }
})
</script>
