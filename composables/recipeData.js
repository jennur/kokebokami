import getRecipeWithMetadata from "~/helpers/get-recipe-with-metadata.js";
import { getAuth } from "firebase/auth";
import useRecipeAuthor from "./recipeAuthor";

// Parameters: recipes/[key].vue/[recipepath].vue
export default async function useRecipeData(params) {
  const auth = getAuth();
    const user = auth.currentUser;

    const headData = ref(null);
    const recipe = ref(null);
    const author = ref(null);
    const loaded = ref(false);

     async function loadRecipe() {
      try {
        const { key, recipepath } = params;
        const recipeFullPath = `${key}/${recipepath}/`;

        const recipeWithMetadata = await getRecipeWithMetadata(recipeFullPath);

        console.log("RecipeWithMetadata:", recipeWithMetadata)
        const recipeAuthor = await useRecipeAuthor(recipeWithMetadata.content?.ownerID);
        if (recipeWithMetadata.structuredData && author) {
          recipeWithMetadata.structuredData.author = author.structuredData;
        }

        headData.value = {
            ...recipeWithMetadata?.metadata,
            script: [
              {
                type: "application/ld+json",
                json: recipeWithMetadata.structuredData
              }
            ]
          };
        recipe.value = recipeWithMetadata.content,
        author.value = recipeAuthor.content;

        console.info("[useRecipeData] Successfully updated")
      } catch(error) {
        console.error("[useRecipeData] Error loading recipe:", error);
      }
      finally {
        loaded.value = true;
      }
    }

    loadRecipe();

    function userHasAccess() {
      if(!recipe.value.public){
        console.log("USER:", user.uid, recipe.value)
        if(user && user.uid === recipe.value.ownerID){
          return true;
        }

        if(!user || (user && !sharedWithUser())){
          return false;
        }
      }
      return true;
    }

    function sharedWithUser() {
      if ((recipe.value.ownerID === user?.uid)) {
        return true;
      }
      else if (user && recipe.value.sharedWith) {
        return Object.values(recipe.value.sharedWith).indexOf(user?.uid) > -1;
      }
      return false;
    }

    return {
      recipe,
      headData,
      author,
      loaded,
      userHasAccess,
      sharedWithUser,
      refresh: loadRecipe
    }
  }