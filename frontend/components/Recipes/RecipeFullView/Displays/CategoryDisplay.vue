<template>
  <div class="recipe__categories margin-top--large">
    <span
      class="recipe__category margin-right--large"
      v-for="(category, index) in categories"
      :key="`category-${index}`"
      >{{ category }}</span
    >
  </div>
</template>
<script>
export default {
  name: "category-display",
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  }
};
</script>
