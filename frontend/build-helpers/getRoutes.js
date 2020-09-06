const axios = require("axios");

module.exports = () => {
  return axios
    .get(
      `https://${process.env.PROJECT_ID}.firebaseio.com/recipes.json?auth=${process.env.DATABASE_SECRET}`
    )
    .then(recipes => {
      recipes = Object.entries(recipes.data)
        .filter(recipe => recipe[1].public)
        .map(recipe => {
          return `/recipes/${recipe[0]}`;
        });
      return ["/", "/login", "/sign-up", "/cookies-policy"].concat(recipes);
    })
    .catch(error => console.log("Error generating routes:", error.message));
};
