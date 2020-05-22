export default {
  data() {
    return {
      publicRecipes,
      publicRecipesError
    };
  },
  mounted() {
    let componentThis = this;
    const publicRecipesRef = $fireDb.ref("recipes").orderByChild("public");
    publicRecipesRef.once(
      "value",
      recipes => {
        let publicRecipes = [];
        recipes.forEach(recipe => {
          if (recipe.exists()) {
            if (recipe.val().public) {
              publicRecipes.push([recipe.key, recipe.val()]);
            }
          }
        });
        componentThis.publicRecipes = publicRecipes;
      },
      error => {
        console.log(
          "Error: Something failed while trying to set public recipes:",
          error
        );
        componentThis.publicRecipesError =
          "Something went wrong while trying to load recipes. If the issue continues, please contact us.";
      }
    );
  }
};
