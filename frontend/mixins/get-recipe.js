import getRecipeAndMetadata from "~/helpers/recipe-metadata.js";
import getRecipeOwner from "~/helpers/recipe-owner";
import generatePath from "~/helpers/generatePath";
import recipeModel from "../helpers/recipe-model";
import userModel from "./user-model";
import getRecipeAuthor from "./get-recipe-author";
import user from "~/mixins/user";

export default {
  data() {
    return {
      userAuth: this.$fire.auth.currentUser,
      recipe: {},
      author: {},
      loaded: false,
      errorMessage: "",
      structuredData: {},
      headData: {}
    };
  },
  async asyncData({ app, params }) {
    try {
      let recipesSnapshot = await app.$fire.database
        .ref("recipes")
        .once("value");

      let recipePath = `${params.key}/${params.recipeid}/`;
      let recipe = getRecipeAndMetadata(recipesSnapshot, recipePath);

      let userSnapshot = recipe.content && await app.$fire.database
        .ref(`users/${recipe.content.ownerID}/displayName`)
        .once("value");

      let author = userSnapshot && getRecipeOwner(userSnapshot, recipe.content.ownerID);

      if (recipe.structuredData && author) {
        recipe.structuredData.author = author.content.displayName;
      }

      return {
        headData: {
          ...recipe.metadata,
          script: [
            {
              type: "application/ld+json",
              json: recipe.structuredData
            },
            {
              type: "application/ld+json",
              json: author.structuredData
            }
          ]
        },
        recipe: recipe.content,
        author: author.content,
        loaded: true
      }
    } catch(error) {
      console.log("Error loading recipe:", error);
      return {
        recipe: {},
        author: {},
        loaded: true
      }
    }
  },
  mixins: [userModel, getRecipeAuthor],
  methods: {
    async getRecipe(key) {
      try {
        console.log("Getting recipe");

        let snapshot = await this.$fire.database
          .ref(`recipes/${key}`)
          .once("value");

        if (snapshot.val()) {
          let recipe = snapshot.val();
          this.recipe = recipeModel(recipe, key);
          this.loaded = true;
        }
      } catch(error) {
        console.log("Error: Failed getting recipe:", error.message);
      }
    },
    userHasAccess(recipe){
      if(!recipe.public){
        if(this.userAuth && this.userAuth.uid === recipe.ownerID){
          return true;
        }

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
  },
  mounted() {
    if(this.recipe && !this.userHasAccess(this.recipe)) {
      this.$router.push("/no-access");
    }
  }
};
