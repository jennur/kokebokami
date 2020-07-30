export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      recipe: [],
      recipeLoaded: false,
      errorMessage: ""
    };
  },
  computed: {
    recipeKey() {
      return this.$route.params.recipeid;
    }
  },
  methods: {
    getRecipe() {
      if (this.userAuth) {
        let recipeRef = this.$fireDb.ref(`recipes/${this.recipeKey}`);
        recipeRef
          .once("value", recipe => {
            if (recipe.exists()) {
              this.recipe = recipe.val();
            }
          })
          .then(() => {
            this.recipeLoaded = true;
          })
          .catch(error =>
            console.log("Error: Failed getting recipe:", error.message)
          );
      }
    }
  },
  created() {
    this.getRecipe();
  }
};
