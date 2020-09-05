export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      recipe: [],
      recipeOwner: {},
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
      let recipeRef = this.$fireDb.ref(`recipes/${this.recipeKey}`);
      recipeRef
        .once("value", recipe => {
          if (recipe.exists()) {
            if (this.userAuth || recipe.val().public === true) {
              recipe = recipe.val();
              let recipeOwnerRef = this.$fireDb.ref(`users/${recipe.ownerID}`);
              recipeOwnerRef.once("value", owner => {
                if (owner.exists()) this.recipeOwner = owner.val();
              });
              this.recipe = recipe;
              this.recipeLoaded = true;
              return true;
            }
            this.$router.push("/404");
            return false;
          } else {
            this.$router.push("/404");
            return false;
          }
        })
        .catch(error => {
          console.log("Error: Failed getting recipe:", error.message);
        });
    }
  },
  created() {
    this.getRecipe();
  }
};
