<template>
  <div class="recipes-list-container">
    <h3 class="recipes-list-container__headline" v-if="headline">{{headline}}</h3>
    <recipe-display v-for="recipe in recipes" :key="recipe.title" :recipe="recipe" />
  </div>
</template>

<script>
import RecipeDisplay from "./RecipeDisplay.vue";

export default {
  name: "recipes-list",
  components: {
    RecipeDisplay
  },
  props: {
    headline: {
      type: String,
      default: null
    }
  },
  computed: {
    recipes() {
      let recipes = [
        {
          title: "The most boring omelette",
          description: `This is the simplest omelette you can possibly make.
          Although it does have flour`,
          ingredients: ["100 g flour", "3 eggs", "3 dl water"],
          instructions: `Mix everything together.
        Put inside oven.
        Bake for 3 hours.
        Enjoy!`
        },
        {
          title: "Coconut tomatoes",
          description: `A dish for coconut and tomato lovers.
          If you also like water, it's your new favourite.`,
          ingredients: ["200 g coconut milk", "3 tomatoes", "3 dl water"],
          instructions: `Mix everything together.
        Fry in a big pan for 10 minutes.
        Enjoy!`
        },
        {
          title: "Coconut tomatoes",
          description: `A dish for coconut and tomato lovers.
          If you also like water, it's your new favourite.`,
          ingredients: ["200 g coconut milk", "3 tomatoes", "3 dl water"],
          instructions: `Mix everything together.
        Fry in a big pan for 10 minutes.
        Enjoy!`
        }
      ];

      return recipes;
    }
  }
};
</script>
