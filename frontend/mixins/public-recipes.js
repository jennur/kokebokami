import recipeModel from "../helpers/recipe-model";
export default {
  data() {
    return {
      publicRecipes: [],
      errorMessage: "",
      loaded: false
    };
  },
  async asyncData({app}){
    try {
      let snapshot = await app.$fire.database
        .ref("recipes")
        .orderByChild("public")
        .once("value");

      let foundRecipes = handleRecipes(snapshot, true);

      return {
        publicRecipes: foundRecipes.reverse(),
        loaded: true
      }
    } catch(error) {
      console.log("Error: Something failed while trying to set public recipes:", error);
      return {
        errorMessage: "Something went wrong while trying to load recipes. If the issue continues, please contact us."
      }
    };
  }
};

function handleRecipes(snapshot, ssr){
  let foundRecipes = [];
  if (snapshot.val()) {
    let recipes = snapshot.val();

    for (let key in recipes) {
      let recipe = recipes[key];
      if (recipe.public) {
        foundRecipes.push(recipeModel(recipe, key, ssr));
      }
    }
  }
  return foundRecipes;
}
