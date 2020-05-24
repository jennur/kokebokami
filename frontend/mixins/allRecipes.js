export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      allRecipes: [],
      errorMessage: ""
    };
  },
  methods: {
    getAllRecipes() {
      let componentThis = this;
      if (this.userAuth) {
        try {
          let allRecipesRef = this.$fireDb.ref("recipes").orderByKey();
          allRecipesRef.once("value", recipes => {
            if (recipes.exists()) {
              componentThis.allRecipes = Object.entries(recipes.val());
            }
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error);
        }
      }
    }
  },
  mounted() {
    this.getAllRecipes();
  }
};
