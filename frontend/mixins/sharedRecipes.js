export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      sharedRecipes: [],
      errorMessage: ""
    };
  },
  created() {
    let componentThis = this;
    if (this.userAuth) {
      let sharedRecipesRef = this.$fireDb
        .ref("recipes")
        .orderByChild("sharedWith");
      sharedRecipesRef.once(
        "value",
        recipes => {
          if (recipes.exists()) {
            recipes = Object.entries(recipes.val());
            componentThis.sharedRecipes = recipes.filter(recipe => {
              let shares = recipe[1].sharedWith
                ? Object.values(recipe[1].sharedWith)
                : [];
              if (shares.length) {
                return shares.indexOf(componentThis.user.id) > -1;
              }
              return false;
            });
          }
        },
        error => {
          console.log("Error: Failed to set shared recipes:", error);
          componentThis.errorMessage =
            "Something went wrong while trying to load your shared recipes. If the issue continues, please contact us.";
        }
      );
    }
  }
};
