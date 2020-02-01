<template>
  <div class="recipe__categories margin-top--large">
    <span
      class="recipe__category margin-right--large"
      v-for="category in categories"
      :key="category"
    >{{ category }}</span>
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
