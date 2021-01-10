import generatePath from "./generatePath";

export default function recipeModel(recipe, key){
  let title = recipe.title || "untitled-recipe";
  recipe.path = generatePath(title, key);
  recipe.id = key;
  return recipe;
}
