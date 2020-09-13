<template>
  <section class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">
      {{ headline }}
    </h3>
    <recipe-preview
      v-for="recipe in recipes"
      :key="recipe[0]"
      :recipeID="recipe[0]"
      :recipe="recipe[1]"
      :inPublicList="isPublicList"
    />
    <div v-if="!recipesLength" class="container">
      <p
        class="margin-bottom--medium mobile-width"
        :class="{ 'margin--auto': centerText }"
      >
        {{ emptyListMessage }}
      </p>
      <nuxt-link v-if="addRecipeUrl" :to="addRecipeUrl"
        >➔ {{ $t("addRecipeToList") }}👨‍🍳</nuxt-link
      >
    </div>
  </section>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "recipes-list",
  components: {
    RecipePreview
  },
  props: {
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
  },
  computed: {
    recipesLength() {
      return this.recipes ? this.recipes.length : 0;
    }
  }
};
</script>
