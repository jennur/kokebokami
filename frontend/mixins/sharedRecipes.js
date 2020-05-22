export default {
  data() {
    return {
      sharedRecipes,
      sharedRecipesError
    };
  },
  mounted() {
    let componentThis = this;
    const sharedRecipesRef = $fireDb.ref("recipes").orderByChild("sharedWith");
    sharedRecipesRef.once(
      "value",
      recipes => {
        let sharedRecipesArray = [];
        recipes.forEach(recipe => {
          if (recipe.exists()) {
            const shares = recipe.val().sharedWith
              ? Object.values(recipe.val().sharedWith)
              : [];
            if (shares.length) {
              shares.forEach(sharedWithUser => {
                if (sharedWithUser === user.id) {
                  sharedRecipesArray.push([recipe.key, recipe.val()]);
                }
              });
            }
          }
        });
        componentThis.sharedRecipes = sharedRecipesArray;
      },
      error => {
        console.log(
          "Error: Something failed while trying to set shared recipes:",
          error
        );
        componentThis.sharedRecipesError =
          "Something went wrong while trying to load your shared recipes. If the issue continues, please contact us.";
      }
    );
  }
};
