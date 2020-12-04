export default {
  data() {
    return {
      userAuth: !!this.$fire.auth.currentUser,
      allRecipes: [],
      errorMessage: ""
    };
  },
  methods: {
    getAllRecipes() {
      let componentThis = this;
      if (this.userAuth) {
        try {
          let allRecipesRef = this.$fire.database.ref("recipes").orderByKey();
          allRecipesRef.once("value", recipes => {
            if (recipes.exists()) {
              componentThis.allRecipes = Object.entries(recipes.val());
            }
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    }
  },
  mounted() {
    this.getAllRecipes();
  }
};
