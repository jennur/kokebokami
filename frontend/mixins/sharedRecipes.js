export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      sharedRecipes: [],
      errorMessage: ""
    };
  },
  methods: {
    getSharedRecipes() {
      let componentThis = this;
      if (this.userAuth) {
        try {
          this.$fire.database
            .ref("recipes")
            .orderByChild("sharedWith")
            .once("value", recipes => {
            if (recipes.exists()) {
              recipes = Object.entries(recipes.val()).reverse();
              componentThis.sharedRecipes = recipes.filter(recipe => {
                let shares = recipe[1].sharedWith
                  ? Object.values(recipe[1].sharedWith)
                  : [];
                if (shares.length) {
                  return shares.indexOf(componentThis.userAuth.uid) > -1;
                }
                return false;
              });
            }
          });
        } catch (error) {
          console.log("Error: Failed to set shared recipes:", error.message);
          componentThis.errorMessage =
            "Something went wrong while trying to load your shared recipes. If the issue continues, please contact us.";
        }
      }
    }
  },
  mounted() {
    this.getSharedRecipes();
  }
};
