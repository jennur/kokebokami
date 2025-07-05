<template>
  <div class="content-dropdown_recipes-list-preview">
    <ul>
      <li v-for="recipe in recipes" :key="`recipe-${recipe.title}`">
        {{ recipe.title }}
      </li>
    </ul>
  </div>
</template>
<script setup>
const props = defineProps({
  recipes: {
    type: Array,
    default: () => [],
  },
});
</script>
