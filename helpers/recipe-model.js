import generatePath from "./generatePath";

export default function recipeModel(recipe, key){
  let title = recipe.title || "untitled-recipe";
  recipe.path = generatePath(title, key);
  recipe.id = key;

  if(recipe.dateModified && !isSameDay(recipe.dateModified, recipe.datePublished)) {
    recipe.dateModified = getDateString(recipe.dateModified);
  } else {
    recipe.dateModified = null;
  }

  if(recipe.datePublished) {
    recipe.datePublished = getDateString(recipe.datePublished);
  }
  return recipe;
}

function isSameDay(ISODate1, ISODate2){
  let date1 = new Date(ISODate1);
  let date2 = new Date(ISODate2);
  return date1.toLocaleDateString() === date2.toLocaleDateString();
}

function getDateString(ISODateString){
  let milliseconds = Date.parse(ISODateString);
  let date = new Date(milliseconds);
  let CETDate = date + 3600000; // + 1hr
  CETDate = new Date(CETDate);
  return `${CETDate.toLocaleDateString()} ${CETDate.toLocaleTimeString()}`;

}
