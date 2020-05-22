export default {
  data() {
    return {
      userRecipes,
      userRecipesError
    };
  },
  mounted() {
    let componentThis = this;
    const userRecipesRef = this.$fireDb.ref("recipes").orderByKey();
    userRecipesRef.once(
      "value",
      recipes => {
        let userRecipes = [];
        recipes.forEach(recipe => {
          if (recipe.val().ownerID === user.id)
            userRecipes.push([recipe.key, recipe.val()]);
        });
        componentThis.userRecipes = userRecipes;
      },
      error => {
        console.log(
          "Error: Something failed when attempting to set recipes: " + error
        );
        componentThis.userRecipesError =
          "Something went wrong while trying to load your recipes. If the issue continues, please contact us.";
      }
    );
  }
};
