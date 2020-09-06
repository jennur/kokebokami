import axios from "axios";
export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      recipe: {},
      recipeOwner: {},
      recipeLoaded: false,
      errorMessage: "",
      structuredData: {},
      headData: {}
    };
  },
  async asyncData({ params }) {
    if (process.server) {
      let recipeID = params.recipeid;
      return await axios
        .get(
          `https://${process.env.PROJECT_ID}.firebaseio.com/recipes/${recipeID}.json?auth=${process.env.DATABASE_SECRET}`
        )
        .then(async recipe => {
          if (recipe.data) {
            recipe = recipe.data;
            let instructions = recipe.instructions;
            instructions = instructions.map(instruction => {
              return {
                "@type": "HowToStep",
                text: instruction
              };
            });
            let categories = Array.isArray(recipe.categories)
              ? recipe.categories.join(",")
              : "";
            let typeOfMeal = Array.isArray(recipe.typeOfMeal)
              ? recipe.typeOfMeal.join(",")
              : "";
            let structuredData = {
              "@context": "https://schema.org/",
              "@type": "Recipe",
              name: recipe.title,
              image: [
                recipe.photoURL ||
                  "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=8c3e8a1a-4226-453b-a256-0ac1060adb59"
              ],
              description: recipe.description || "",
              keywords: categories,
              recipeYield: recipe.servings || 0,
              recipeCategory: typeOfMeal,

              recipeIngredient: recipe.ingredients || [],
              recipeInstructions: instructions || []
            };
            return {
              headData: {
                title: `${recipe.title} | Kokebokami`,
                meta: [
                  {
                    property: "og:url",
                    content: `https://wwww.kokebokami.com/recipes/${recipeID}/`
                  },
                  {
                    property: "og:type",
                    content: `article`
                  },
                  {
                    property: "og:title",
                    content: recipe.title || "Untitled recipe"
                  },
                  {
                    property: "og:description",
                    content: recipe.description || "No description available"
                  },
                  {
                    property: "og:image",
                    content:
                      recipe.photoURL ||
                      "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=8c3e8a1a-4226-453b-a256-0ac1060adb59"
                  }
                ],
                script: [
                  {
                    type: "application/ld+json",
                    json: structuredData
                  }
                ]
              }
            };
          }
          return { recipe: { ownerID: null } };
        })
        .catch(error => console.log("Error getting recipe:", error.message));
    }
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
            recipe = recipe.val();
            let userRef = this.$fireDb.ref(`users/${recipe.ownerID}`);
            userRef
              .once("value", user => {
                if (user.exists()) {
                  user = user.val();
                  this.recipeOwner = {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    id: recipe.ownerID
                  };
                }
              })
              .catch(error =>
                console.log("Error getting recipe owner:", error)
              );
            if (
              (!this.userAuth && !recipe.public) ||
              (this.userAuth &&
                !recipe.public &&
                !this.checkIfSharedWithMe(recipe))
            ) {
              this.$router.push("/no-access");
            } else {
              this.recipe = recipe;
              this.recipeLoaded = true;
            }
          } else {
            this.$router.push("/no-access");
          }
        })
        .catch(error => {
          console.log("Error: Failed getting recipe:", error.message);
        });
    },
    checkIfSharedWithMe(recipe) {
      let user = this.user;
      if (user) {
        if (recipe.ownerID === user.id) return true;
        else if (user && recipe.sharedWith) {
          return Object.values(recipe.sharedWith).indexOf(user.id) > -1;
        }
      }
      return false;
    }
  },
  created() {
    this.getRecipe();
  }
};
