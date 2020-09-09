import axios from "axios";
import getUserByID from "~/mixins/getUserByID.js";
export default {
  data() {
    return {
      userAuth: !!this.$fireAuth.currentUser,
      recipe: {},
      cook: {},
      recipeLoaded: false,
      errorMessage: "",
      structuredData: {},
      headData: {}
    };
  },
  mixins: [getUserByID],
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
            let recipeAuthor = await axios
              .get(
                `https://${process.env.PROJECT_ID}.firebaseio.com/users/${recipe.ownerID}.json?auth=${process.env.DATABASE_SECRET}`
              )
              .then(user => {
                return user.data.displayName;
              })
              .catch(error => {
                console.log("Error getting user:", error.message);
                return "Kokebokami user";
              });
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
              url: `https://kokebokami.com/recipes/${recipeID}`,
              author: recipeAuthor,
              name: recipe.title,
              image: [
                recipe.photoURL ||
                  "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=67cb87a6-78ae-4b45-bdec-44b8e702b842"
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
                link: [
                  {
                    rel: "canonical",
                    href: `https://kokebokami.com/recipes/${recipeID}/`
                  }
                ],
                meta: [
                  {
                    hid: "title",
                    name: "title",
                    content: recipe.title || "Kokebokami"
                  },
                  {
                    hid: "description",
                    name: "description",
                    content:
                      recipe.description ||
                      "No description available for this recipe"
                  },
                  {
                    hid: "keywords",
                    name: "keywords",
                    content: categories || "recipe, kokebokami"
                  },
                  {
                    hid: "og:url",
                    property: "og:url",
                    content: `https://kokebokami.com/recipes/${recipeID}/`
                  },
                  {
                    hid: "og:type",
                    property: "og:type",
                    content: `article`
                  },
                  {
                    hid: "og:title",
                    property: "og:title",
                    content: recipe.title || "Untitled recipe"
                  },
                  {
                    hid: "og:description",
                    property: "og:description",
                    content: recipe.description || "No description available"
                  },
                  {
                    hid: "og:image",
                    property: "og:image",
                    content:
                      recipe.photoURL ||
                      "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=67cb87a6-78ae-4b45-bdec-44b8e702b842"
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

            if (
              (!this.userAuth && !recipe.public) ||
              (this.userAuth &&
                !recipe.public &&
                !this.recipeIsSharedWithMe(recipe))
            ) {
              this.$router.push("/no-access");
              return false;
            } else {
              this.recipe = recipe;
              this.recipeLoaded = true;
            }
            this.$fireDb
              .ref(`users/${recipe.ownerID}/displayName`)
              .once("value", displayName => {
                if (displayName.exists()) {
                  this.cook = {
                    id: recipe.ownerID,
                    displayName: displayName.val()
                  };
                }
              });
          } else {
            this.$router.push("/no-access");
          }
        })
        .catch(error => {
          console.log("Error: Failed getting recipe:", error.message);
        });
    },
    recipeIsSharedWithMe(recipe) {
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
