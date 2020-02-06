<template>
  <div class="recipe__category-note margin-top--small">
    <p class="margin-top--small margin-bottom--small">
      <b>Meal type:</b>
      {{ whatTypeOfMeal }}
    </p>
  </div>
</template>
<script>
export default {
  name: "type-of-meal-display",
  props: {
    typeOfMeal: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    whatTypeOfMeal() {
      return this.typeOfMeal
        .map(type => {
          return type.charAt(0).toUpperCase() + type.slice(1, type.length);
        })
        .join(", ");
    }
  }
};
</script>
