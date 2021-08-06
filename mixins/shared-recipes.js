import recipeModel from "../helpers/recipe-model";

export default {
  data() {
    return {
      currentUser: this.$fire.auth.currentUser,
      sharedRecipes: [],
      errorMessage: "",
      loaded: false
    };
  },
  methods: {
    getSharedRecipes() {
      if (this.currentUser) {
        try {
          this.$fire.database
            .ref("recipes")
            .orderByChild("sharedWith")
            .once("value", snapshot => {
              if (snapshot.exists()) {
                let recipes = snapshot.val();

                for(let key in recipes) {
                  let recipe = recipes[key];

                  if(recipe.sharedWith && Object.values(recipe.sharedWith).indexOf(this.currentUser.uid) > -1) {
                    this.sharedRecipes.push(recipeModel(recipe, key));
                    this.loaded = true;
                  }
                }
              }
            })
        } catch (error) {
          console.log("Error: Failed to set shared recipes:", error.message);
          this.errorMessage =
            "Something went wrong while trying to load your shared recipes. If the issue continues, please contact us.";
        }
      }
    }
  },
  mounted() {
    this.getSharedRecipes();
  }
};
