import generatePath from "../helpers/generatePath";

export default {
  methods: {
    recipeModel(recipe, key) {
      let title = recipe.title || "untitled-recipe";
      recipe.path = generatePath(title, key);
      recipe.id = key;
      return recipe;
    }
  }
}
