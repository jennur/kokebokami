<template>
  <div>
    <h4 v-if="instructions">Instructions</h4>
    <ol class="recipe__instructions">
      <li
        class="recipe__instructions-step"
        v-for="step in instructions"
        :key="step"
      >{{ step ? step : "Recipe has no instructions" }}</li>
    </ol>
  </div>
</template>
<script>
export default {
  name: "instructions-display",
  props: {
    instructions: {
      type: Array,
      default: () => []
    }
  }
};
</script>
