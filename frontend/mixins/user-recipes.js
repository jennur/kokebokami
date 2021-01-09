import recipeModel from "../helpers/recipe-model";

export default {
  data() {
    return {
      currentUser: this.$fire.auth.currentUser,
      userRecipes: [],
      errorMessage: "",
      loaded: false
    };
  },
  methods: {
    getUserRecipes() {
      if (this.currentUser) {
        try {
          this.$fire.database
          .ref("recipes")
          .once("value", async snapshot => {
            if (snapshot.exists()) {
              let userRecipes = [];
              let recipes = snapshot.val();
              for(let key in recipes){
                let recipe = recipes[key];

                if(recipe.ownerID === this.currentUser.uid) {
                  userRecipes.push(recipeModel(recipe, key))
                }
              }
              this.userRecipes = userRecipes.reverse();
            }
          })
          .then(() => {
            this.loaded = true;
          });
        } catch (error) {
          console.log("Error: Failed setting recipes:", error.message);
        }
      }
    }
  },
  mounted() {
    this.getUserRecipes();
    this.getRecipeLinks();
  }
};
