<template>
  <div>
    <breadcrumbs :routes="breadcrumbs" />
    <!--     <add-recipe-form :recipe="recipe" /> -->
    <recipe-full-view
      v-if="recipe"
      :recipe="recipe"
      :isRecipeOwner="true"
      @update="saveRecipe"
    />
  </div>
</template>

<script>
import userRecipes from "~/mixins/userRecipes.js";
import RecipeFullView from "~/components/Recipes/RecipeFullView/RecipeFullView.vue";
import user from "~/mixins/user.js";

export default {
  name: "addRecipe",
  head() {
    return {
      title: `Add new recipe | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/add-recipe/"
        }
      ]
    };
  },
  components: { RecipeFullView },
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
  mixins: [user],

  data() {
    return {
      recipeKey: null,
      recipe: {
        public: false,
        title: "",
        description: "",
        ingredients: [],
        instructions: [],
        categories: [],
        typeOfMeal: [],
        freeFrom: []
      }
    };
  },
  methods: {
    saveRecipe(payload) {
      let recipeKey = this.recipeKey;

      if (!recipeKey) {
        let newRecipeRef = this.$fireDb.ref("recipes");
        let recipeObj = {
          ...payload,
          ownerID: this.user.id
        };
        newRecipeRef
          .push(recipeObj)
          .then(result => {
            console.log("Saved new recipe");
            this.recipeKey = result.key;
          })
          .then(() => {
            this.getRecipe();
          });
      } else {
        let recipeRef = this.$fireDb.ref(`recipes/${recipeKey}`);
        recipeRef
          .update(payload)
          .then(() => {
            console.log("Successfully set payload:", payload);
          })
          .then(() => {
            this.getRecipe();
          });
      }
    },
    getRecipe() {
      if (this.user) {
        let recipeRef = this.$fireDb.ref(`recipes/${this.recipeKey}`);
        recipeRef
          .once("value", recipe => {
            if (recipe.exists()) {
              this.recipe = recipe.val();
            }
          })
          .catch(error =>
            console.log("Error: Failed getting recipe:", error.message)
          );
      }
    }
  }
};
</script>
