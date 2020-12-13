import getRecipeMetadata from "~/helpers/recipe-metadata.js";
import generatePath from "../helpers/generatePath";
import recipeModel from "./recipe-model";
import userModel from "./user-model";
import getRecipeAuthor from "./get-recipe-author";

export default {
  data() {
    return {
      userAuth: !!this.$fire.auth.currentUser,
      recipe: {},
      cook: {},
      recipeLoaded: false,
      errorMessage: "",
      structuredData: {},
      headData: {}
    };
  },
  async asyncData({ params }) {
    if (process.server) {
      return await getRecipeMetadata(`${params.key}/${params.recipeid}/`);
    }
  },
  mixins: [recipeModel, userModel, getRecipeAuthor],
  methods: {
    getRecipeKey() {
      let keySegment = this.$route.params.key;
      let title = this.$route.params.recipeid;
      let recipePath = `${keySegment}/${title}/`;

      this.$fire.database
        .ref("recipes")
        .once("value", snapshot => {
          let recipes = snapshot.val();
          for(let key in recipes){
            if(recipePath === generatePath(recipes[key].title, key, true)) {
              this.getRecipe(key);
              return;
            }
          }
        })
    },
    async getRecipe(key) {
      this.$fire.database
        .ref(`recipes/${key}`)
        .once("value", async snapshot => {
          console.log("Getting recipe");
          if (snapshot.exists()) {
            let recipe = snapshot.val();

            if (this.userHasAccess(recipe)) {
              this.recipe = this.recipeModel(recipe, key);
              this.recipeLoaded = true;
              return;
            }
          }

          this.$router.push("/no-access");
        })
        .catch(error => {
          console.log("Error: Failed getting recipe:", error.message);
        });
    },
    userHasAccess(recipe){
      if(!recipe.public){
        if(!this.userAuth || (this.userAuth && !this.sharedWithUser(recipe))){
          return false;
        }
      }
      return true;
    },
    sharedWithUser(recipe) {
      if (this.user && (recipe.ownerID === this.user.id)) {
        return true;
      }
      else if (this.user && recipe.sharedWith) {
        return Object.values(recipe.sharedWith).indexOf(this.user.id) > -1;
      }
      return false;
    }
  }
};
