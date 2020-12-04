export default {
  data() {
    return {
      userAuth: !!this.$fire.auth.currentUser,
      publicRecipes: [],
      errorMessage: "",
      loaded: false,
      initialRecipes: []
    };
  },
  methods: {
    getPublicRecipes() {
      let componentThis = this;
      try {
        let publicRecipesRef = this.$fire.database
          .ref("recipes")
          .orderByChild("public");
        publicRecipesRef
          .once("value", recipes => {
            if (recipes.exists()) {
              recipes = Object.entries(recipes.val());
              let publicRecipes = recipes.filter(recipe => {
                return recipe[1].public;
              });
              componentThis.publicRecipes = publicRecipes;
              let language = "English";
              if (this.$i18n.locale === "no") language = "Norwegian";

              componentThis.initialRecipes = publicRecipes.filter(recipe => {
                return (
                  recipe[1].language &&
                  recipe[1].language.toLowerCase() === language.toLowerCase()
                );
              });
            }
          })
          .then(() => {
            this.loaded = true;
          });
      } catch (error) {
        console.log(
          "Error: Something failed while trying to set public recipes:",
          error
        );
        componentThis.errorMessage =
          "Something went wrong while trying to load recipes. If the issue continues, please contact us.";
      }
    }
  },
  created() {
    this.getPublicRecipes();
  }
};
