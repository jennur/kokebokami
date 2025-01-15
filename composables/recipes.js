import { getDatabase, ref, get } from "firebase/database";

export default async function useRecipes(){
  try {
    console.info("[useRecipes] Getting recipes")
    const db = getDatabase();
    const dbRef = ref(db, "recipes");
    const snapshot = await get(dbRef);

    
    console.info("[useRecipes] Loaded")
    return {
      recipes: snapshot.val(),
      loaded: true,
      errorMessage: null
    }
  } catch(error) {
    console.error("[useRecipes]", error);

    return {
      recipes: [],
      loaded: true,
      errorMessage: "Something went wrong while trying to load recipes."
    }
  }
};