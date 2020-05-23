//Must be used in combination with user-mixin
export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      userRecipes: [],
      errorMessage: ""
    };
  },
  created() {
    let componentThis = this;
    if (this.userAuth) {
      let userRecipesRef = this.$fireDb.ref("recipes").orderByKey();
      userRecipesRef.once(
        "value",
        recipes => {
          if (recipes.exists()) {
            recipes = Object.entries(recipes.val());
            componentThis.userRecipes = recipes.filter(recipe => {
              return recipe[1].ownerID === componentThis.user.id;
            });
          }
        },
        error => {
          console.log("Error: Failed setting recipes:", error);
          componentThis.errorMessage =
            "Something went wrong while trying to load your recipes. If the issue continues, please contact us.";
        }
      );
    }
  }
};
