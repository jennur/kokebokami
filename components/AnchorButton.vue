<template>
  <a ref="anchorButton" class="anchor-button" :href="`#${scrollTo}`">
    <i-down-arrow />
  </a>
</template>

<script setup>
const props = defineProps({
  scrollTo: {
    type: String,
    default: ""
  }
});
</script>
