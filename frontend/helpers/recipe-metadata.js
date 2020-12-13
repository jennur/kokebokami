import axios from "axios";
import generatePath from "./generatePath";
const backupImg = "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=67cb87a6-78ae-4b45-bdec-44b8e702b842";
const databaseRecipesURL = `https://${process.env.PROJECT_ID}.firebaseio.com/recipes.json?auth=${process.env.DATABASE_SECRET}`;
const databaseUsersURL = (userID) => `https://${process.env.PROJECT_ID}.firebaseio.com/users/${userID}/displayName.json?auth=${process.env.DATABASE_SECRET}`;

export default function getRecipeMetadata(recipePath){
  return axios
    .get(databaseRecipesURL)
    .then(async recipes => {
      if (recipes.data) {
        recipes = recipes.data;

        for(let key in recipes) {
          let recipe = recipes[key];
          let title = recipe && recipe.title || "untitled-recipe";
          let path = generatePath(title, key, true);

          if(path === recipePath){
            let author = await axios
              .get(databaseUsersURL(recipe.ownerID))
              .then(user => {
                let cookPath = generatePath(user.data, recipe.ownerID, true);
                return {
                  "@type": "Person",
                  name: user.data,
                  url: `https://kokebokami.com/cooks/${cookPath}`
                }
              })
              .catch(error => {
                console.log("Error getting user:", error.message);
                return "Kokebokami user";
              });

              let instructions = recipe.instructions && recipe.instructions.map(instruction => {
                return {
                  "@type": "HowToStep",
                  text: instruction
                };
              });
              let categories = Array.isArray(recipe.categories) && recipe.categories.join(", ") || "";
              let typeOfMeal = Array.isArray(recipe.typeOfMeal) && recipe.typeOfMeal.join(", ") || "";

              let recipeMetaData = {
                url: `https://kokebokami.com/recipes/${path}`,
                name: recipe.title,
                description: recipe.description || "",
                keywords: categories || [],
                image: [ recipe.photoURL || backupImg ]
              }

              let structuredData = {
                "@context": "https://schema.org/",
                "@type": "Recipe",
                ...recipeMetaData,
                author,
                "recipeYield": recipe.servings || 0,
                "recipeCategory": typeOfMeal,
                "recipeIngredient": recipe.ingredients || [],
                "recipeInstructions": instructions || [],
                "isAccessibleForFree": true,
                "mainEntityOfPage": recipeMetaData.url,
                "totalTime": recipe.prepTime || "",
                "publisher": {
                  "@type": "Organization",
                  "name": "kokebokami.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2Fkokebokami-assets%2FlogoK-round.png?alt=media&token=a018646d-0837-44cc-9a2c-01c251f5ec84",
                    "width": 500,
                    "height": 500
                  },
                  "sameAs": ["https://www.facebook.com/kokebokami"]
                },
                "datePublished": recipe.datePublished || "",
                "dateModified": recipe.dateModified || ""
              };

              return {
                headData: {
                  ...metadata(recipeMetaData),
                  script: [
                    {
                      type: "application/ld+json",
                      json: structuredData
                    }
                  ]
                }
              };
          }
        };
      }
      return { recipe: { ownerID: null } };
    })
    .catch(error => console.log("Error getting recipe:", error.message));
}

const metadata = (values) => {
  return {
      link: [
        {
          rel: "canonical",
          href: values.url
        }
      ],
      meta: [
        {
          hid: "title",
          name: "title",
          content: values.name || "Kokebokami"
        },
        {
          hid: "description",
          name: "description",
          content: values.description || "No description available for this recipe"
        },
        {
          hid: "keywords",
          name: "keywords",
          content: values.keywords || "recipe, kokebokami"
        },
        {
          hid: "og:url",
          property: "og:url",
          content: values.url
        },
        {
          hid: "og:type",
          property: "og:type",
          content: `article`
        },
        {
          hid: "og:title",
          property: "og:title",
          content: values.name || "Untitled recipe"
        },
        {
          hid: "og:description",
          property: "og:description",
          content: values.description || "No description available"
        },
        {
          hid: "og:image",
          property: "og:image",
          content: values.image[0]
        }
      ]
  }
}