<template>
  <div class="recipe__category-note margin-top--small">
    <p class="margin-top--small margin-bottom--small">
      <b>Free from:</b>
      {{ freeFromAllergens }}
    </p>
  </div>
</template>
<script>
export default {
  name: "free-from-display",
  props: {
    freeFrom: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    freeFromAllergens() {
      return this.freeFrom
        .map(allergen => {
          return (
            allergen.charAt(0).toUpperCase() +
            allergen.slice(1, allergen.length)
          );
        })
        .join(", ");
    }
  }
};
</script>
