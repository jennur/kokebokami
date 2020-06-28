<template>
  <div>
    <h4 v-if="instructions">Instructions</h4>
    <ol class="recipe__instructions">
      <li
        tabindex="-1"
        class="recipe__instructions-step"
        v-for="(step, index) in instructions"
        :key="`instruction-${index}`"
      >
        {{ step ? step : "Recipe has no instructions" }}
      </li>
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
