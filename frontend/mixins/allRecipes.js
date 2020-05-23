export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      allRecipes: [],
      errorMessage: ""
    };
  },
  created() {
    let componentThis = this;
    if (this.userAuth) {
      let allRecipesRef = this.$fireDb.ref("recipes").orderByKey();
      allRecipesRef.once(
        "value",
        recipes => {
          if (recipes.exists()) {
            componentThis.allRecipes = Object.entries(recipes.val());
          }
        },
        error => {
          console.log("Error: Failed setting recipes:", error);
          componentThis.errorMessage =
            "Something went wrong while trying to load the recipes. If the issue continues, please contact us.";
        }
      );
    }
  }
};
