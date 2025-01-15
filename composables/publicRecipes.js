import recipeModel from "../helpers/recipe-model";
import { getDatabase, ref, get } from "firebase/database";

export default async function usePublicRecipes(){
  try {
    console.info("[usePublicRecipes] Getting recipes")
    const db = getDatabase();
    const dbRef = ref(db, "recipes");
    const snapshot = await get(dbRef);
    
    const publicRecipes = filterOnPublic(snapshot);
    
    console.info("[usePublicRecipes] Loaded")
    return {
      publicRecipes: publicRecipes.reverse(),
      loadedRecipes: true,
      errorMessage: ""
    }
  } catch(error) {
    console.error("[usePublicRecipes]", error);

    return {
      publicRecipes: [],
      loadedRecipes: true,
      errorMessage: "Something went wrong while trying to load recipes. If the issue continues, please contact us."
    }
  }
};

function filterOnPublic(snapshot){
  let publicRecipes = [];
  if (snapshot.val()) {
    let recipes = snapshot.val();

    for (let key in recipes) {
      let recipe = recipes[key];
      if (recipe.public) {
        publicRecipes.push(recipeModel(recipe, key));
      }
    }
  }
  return publicRecipes;
}
