import { getDatabase, ref, get } from "firebase/database";
import getRecipeAndMetadata from "~/helpers/get-recipe-and-metadata.js";
import getRecipeOwner from "~/helpers/recipe-owner";
import recipeModel from "~/helpers/recipe-model";
import { useCurrentUser } from 'vuefire'

export default {
  data() {
    return {
      userAuth: useCurrentUser(),
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
      const db = getDatabase();
      console.log("GETTING RECIPE DATA")
      
      const snapshot = await get(ref(db, `recipes/${params.key}`));
      console.log("SNAPSHOT:", snapshot.val());

      let recipePath = `${params.key}/${params.recipeid}/`;
      let recipe = getRecipeAndMetadata(snapshot, recipePath);

      let userSnapshot = recipe.content && await get(ref(db, `users/${recipe.content.ownerID}/displayName`));

      let author = userSnapshot && getRecipeOwner(userSnapshot, recipe.content.ownerID);

      if (recipe.structuredData && author) {
        recipe.structuredData.author = author.structuredData;
      }

      return {
        headData: {
          ...recipe.metadata,
          script: [
            {
              type: "application/ld+json",
              json: recipe.structuredData
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
  methods: {
    async getRecipe(key) {
      try {
        console.log("Getting recipe");

        const db = getDatabase();
        console.log("GETTING RECIPE DATA getRecipe")
        const dbRef = ref(db, `recipes/${key}`);
        const snapshot = await get(dbRef);

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
  created() {
    if(this.recipe && !this.userHasAccess(this.recipe)) {
      this.$router.push("/no-access");
    }
  }
};
