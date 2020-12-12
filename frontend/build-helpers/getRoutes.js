const axios = require("axios");
import generatePath from "../helpers/generatePath";

module.exports = () => {
  return axios
    .get(
      `https://${process.env.PROJECT_ID}.firebaseio.com/recipes.json?auth=${process.env.DATABASE_SECRET}`
    )
    .then(recipes => {
      let links = ["/", "/login", "/sign-up", "/cookies-policy"];
      recipes = recipes.data;

      for(let key in recipes) {
        let recipe = recipes[key];

        if(recipe.public && recipe.title){
          let path = generatePath(recipe.title, key, true);
          if(recipe.categories) {
            let categories = Object.values(recipe.categories);
            categories
            .filter(category => category)
            .map(category => {
              category = category.replace(/ /g, "-").replace(/&/g, "and").toLowerCase();
              links.push(`/recipes/${category}/${path}`);
            });
          }
          links.push(`/recipes/${path}`);
        }
      }
      return links;
    })
    .catch(error => console.log("Error generating routes:", error.message));
};
