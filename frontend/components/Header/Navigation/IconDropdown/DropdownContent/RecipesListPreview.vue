<template>
  <div class="content-dropdown_recipes-list-preview">
    <ul>
      <li v-for="recipe in recipes" :key="`recipe-${recipe.title}`">
        {{ recipe.title }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "recipes-list-preview",
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  }
};
</script>
