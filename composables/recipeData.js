import { getDatabase, ref, get } from "firebase/database";
import getRecipeWithMetadata from "~/helpers/get-recipe-with-metadata.js";
import recipeModel from "~/helpers/recipe-model";
import { useCurrentUser } from 'vuefire'
import useRecipeAuthor from "./recipeAuthor";

// Parameters: recipes/[key].vue/[recipeid].vue
export default async function useRecipeData(params) {
    const user = useCurrentUser();

    const recipeData = {
      headData: {},
      recipe: {},
      author: {},
      loaded: true,
      userHasAccess,
      sharedWithUser
    }

    try {
      console.log("[useRecipeData] GETTING RECIPE DATA")
      const { key, recipeid } = params;
      const recipePath = `${key}/${recipeid}/`;
      console.log("RECIPE PATH:", recipePath);
      const recipeWithMetadata = getRecipeWithMetadata(recipePath);

      const author = recipeWithMetadata?.content?.ownerID && useRecipeAuthor(recipeWithMetadata.content.ownerID);

      if (recipeWithMetadata.structuredData && author) {
        recipeWithMetadata.structuredData.author = author.structuredData;
      }

      recipeData.headData = {
          ...recipeWithMetadata.metadata,
          script: [
            {
              type: "application/ld+json",
              json: recipeWithMetadata.structuredData
            }
          ]
        };
      recipeData.recipe = recipeModel(recipeWithMetadata.content),
      recipeData.author = author.content;

    } catch(error) {
      console.error("Error loading recipe:", error);
    }

    return recipeData

    function userHasAccess() {
      const recipe = recipeData.recipe;
      if(!recipe.public){
        if(user.value && user.value.uid === recipe.ownerID){
          return true;
        }

        if(!user.value || (user.value && !this.sharedWithUser(recipe))){
          return false;
        }
      }
      return true;
    }

    function sharedWithUser() {
      const recipe = recipeData.recipe;
      if ((recipe.ownerID === user.value?.uid)) {
        return true;
      }
      else if (user.value && recipe.sharedWith) {
        return Object.values(recipe.sharedWith).indexOf(user.value?.uid) > -1;
      }
      return false;
    }
  }