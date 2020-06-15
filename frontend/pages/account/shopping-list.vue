<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
  </div>
</template>

<script>
import userRecipes from "~/mixins/userRecipes.js";
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";

export default {
  name: "addRecipe",
  components: { AddRecipeForm },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My account", link: "/account/" },
        { name: "Shopping list" }
      ]
    }
  },
  computed: {}
};
</script>
