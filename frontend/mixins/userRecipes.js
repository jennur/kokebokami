export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      userRecipes: [],
      errorMessage: ""
    };
  },
  methods: {
    getUserRecipes() {
      let componentThis = this;
      if (this.userAuth) {
        try {
          let userRecipesRef = this.$fire.database.ref("recipes").orderByKey();
          userRecipesRef.once("value", recipes => {
            if (recipes.exists()) {
              recipes = Object.entries(recipes.val());
              componentThis.userRecipes = recipes.filter(recipe => {
                return recipe[1].ownerID === componentThis.userAuth.uid;
              });
            }
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    }
  },
  mounted() {
    this.getUserRecipes();
  }
};
