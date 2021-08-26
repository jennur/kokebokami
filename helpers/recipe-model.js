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
  date = new Date(date);
  let time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC', timeZoneName: 'short', hour: '2-digit', minute: '2-digit' })
  return `${date.toLocaleDateString()} ${time}`;
}

// function createCommentObj(comment) {
//   comment = {
//     ...comment[1],
//     key: comment[0]
//   };
//   let submitDate = comment.submitDate.replace(/"/g, "");
//   let dateString = getDateString(submitDate);
//   comment.submitDate = dateString;

//   if (comment.isAnonymous) {
//     comment.username = "Anonymous";
//     comment.photoURL = "";
//   }
//   return comment;
// }