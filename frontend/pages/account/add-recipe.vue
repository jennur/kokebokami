<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <add-recipe-form :recipe="recipe" />
  </div>
</template>

<script>
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";

export default {
  name: "addRecipe",
  components: { AddRecipeForm },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My recipes", link: "/my-recipes" },
        { name: "Add recipe" }
      ]
    }
  },
  computed: {
    recipe() {
      let recipes = this.$store.state.recipes;
      return recipes.find(recipe => {
        return recipe.id === this.$route.params.recipeid;
      });
    }
  }
};
</script>
