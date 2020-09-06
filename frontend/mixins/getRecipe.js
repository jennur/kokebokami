export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      recipe: [],
      recipeOwner: {},
      recipeLoaded: false,
      errorMessage: "",
      structuredData: {}
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
              let instructions = recipe.instructions;
              instructions = instructions.map(instruction => {
                return {
                  "@type": "HowToStep",
                  text: instruction
                };
              });
              this.structuredData = {
                "@context": "https://schema.org/",
                "@type": "Recipe",
                name: recipe.title,
                image: [
                  recipe.photoURL
                    ? recipe.photoURL
                    : "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=8c3e8a1a-4226-453b-a256-0ac1060adb59"
                ],
                description: recipe.description ? recipe.description : "",
                keywords: recipe.categories ? recipe.categories.join(",") : "",
                recipeYield: recipe.servings ? recipe.servings : 0,
                recipeCategory: recipe.typeOfMeal
                  ? recipe.typeOfMeal.join(",")
                  : "",

                recipeIngredient: recipe.ingredients ? recipe.ingredients : [],
                recipeInstructions: instructions ? instructions : []
              };
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
