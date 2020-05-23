export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      publicRecipes: [],
      errorMessage: ""
    };
  },
  beforeMount() {
    let componentThis = this;
    if (this.userAuth) {
      let publicRecipesRef = this.$fireDb.ref("recipes").orderByChild("public");
      publicRecipesRef.once(
        "value",
        recipes => {
          if (recipes.exists()) {
            recipes = Object.entries(recipes.val());
            componentThis.publicRecipes = recipes.filter(recipe => {
              return recipe[1].public;
            });
          }
        },
        error => {
          console.log(
            "Error: Something failed while trying to set public recipes:",
            error
          );
          componentThis.errorMessage =
            "Something went wrong while trying to load recipes. If the issue continues, please contact us.";
        }
      );
    }
  }
};
