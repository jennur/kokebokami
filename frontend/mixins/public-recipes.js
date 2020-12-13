import recipeModel from "./recipe-model";
export default {
  data() {
    return {
      publicRecipes: [],
      errorMessage: "",
      loaded: false
    };
  },
  mixins: [recipeModel],
  computed: {
    initialRecipes() {
      let language = "English";
      if (this.$i18n.locale === "no") language = "Norwegian";

      return this.publicRecipes.filter(recipe => {
        return (
          recipe.language &&
          recipe.language.toLowerCase() === language.toLowerCase()
        );
      });
    }
  },
  methods: {
    getPublicRecipes() {
      try {
        this.$fire.database
          .ref("recipes")
          .orderByChild("public")
          .once("value", async snapshot => {
            if (snapshot.exists()) {
              let recipes = snapshot.val();

              for(let key in recipes) {
                let recipe = recipes[key];
                if(recipe.public){
                  this.publicRecipes.push(this.recipeModel(recipe, key));
                }
              }
              this.publicRecipes.reverse();
              this.loaded = true;
            }
          })
      } catch (error) {
        console.log(
          "Error: Something failed while trying to set public recipes:",
          error
        );
        this.errorMessage =
          "Something went wrong while trying to load recipes. If the issue continues, please contact us.";
      }
    }
  },
  created() {
    this.getPublicRecipes();
  }
};
