<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <add-recipe-form :recipe="recipe" />
  </div>
</template>

<script>
import userRecipes from "~/mixins/userRecipes.js";
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";

export default {
  name: "addRecipe",
  head() {
    return {
      title: `Add new recipe | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/add-recipe/"
        }
      ]
    };
  },
  components: { AddRecipeForm },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My cookbook", link: "/account/my-cookbook/" },
        { name: "Add recipe" }
      ]
    }
  },
  computed: {
    recipe() {
      let recipes = this.userRecipes;
      return (
        recipes &&
        recipes.find(recipe => {
          return recipe.id === this.$route.params.recipeid;
        })
      );
    }
  }
};
</script>
