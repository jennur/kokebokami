<template>
  <section class="recipes-list-container">
    <h3 class="recipes-list-container_headline" v-if="headline">
      {{ headline }}
    </h3>
    <RecipePreview
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipeID="recipe.id"
      :recipe="recipe"
      :inPublicList="isPublicList"
    />
    <div v-if="!recipesLength" class="container">
      <p
        class="margin-bottom-md mobile-width"
        :class="{ 'margin-auto': centerText }"
      >
        {{ emptyListMessage }}
      </p>
      <NuxtLink v-if="addRecipeUrl" :to="addRecipeUrl">
        ➔ {{ $t("addRecipeToList") }}👨‍🍳
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import RecipePreview from "./RecipePreview.vue";

const props = defineProps({
  recipeID: {
    type: String,
    default: null
  },
  recipes: {
    type: Array,
    default: null
  },
  headline: {
    type: String,
    default: null
  },
  isPublicList: {
    type: Boolean,
    default: false
  },
  emptyListMessage: {
    type: String,
    default: "Looks like there is nothing here at the moment 😕"
  },
  addRecipeUrl: {
    type: String,
    default: ""
  },
  centerText: {
    type: Boolean,
    default: false
  }
});

const recipesLength = computed(() => {
  return props.recipes ? props.recipes.length : 0;
});
</script>
