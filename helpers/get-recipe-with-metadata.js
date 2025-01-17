import { getDatabase, ref, get } from "firebase/database";

import generatePath from "./generatePath";
import recipeModel from "./recipe-model";
import getTotalTime from "./get-total-time";

const backupImg =
  "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2FrecipeImage%2Frecipe-backup-img.png?alt=media&token=67cb87a6-78ae-4b45-bdec-44b8e702b842";

export default async function getRecipeWithMetadata(recipePath) {
  const db = getDatabase();
  const recipeData = {
    content: { ownerID: null },
    metadata: {},
    structuredData: {},
  };

  try {
    const snapshot = get(ref(db, "recipes"));
    if (snapshot.exists()) {
      const recipes = snapshot.val();
      for (const key in recipes) {
        const recipe = recipes[key];
        const title = (recipe && recipe.title) || "untitled-recipe";
        const path = generatePath(title, key);

        if (path === recipePath) {
          // Format instructions
          const instructions =
            recipe.instructions &&
            recipe.instructions.map((instruction, index) => {
              return {
                "@type": "HowToStep",
                name: `Step ${index + 1}`,
                text: instruction,
                url: `https://kokebokami.com/recipes/${path}#step${index + 1}`,
              };
            });

          // Find suitable diets
          const suitableDiets = [];
          Array.isArray(recipe.freeFrom) &&
            recipe.freeFrom.forEach((allergen) => {
              if (allergen === "gluten")
                suitableDiets.push("https://schema.org/GlutenFreeDiet");
              if (allergen === "dairy")
                suitableDiets.push("https://schema.org/LowLactoseDiet");
              if (allergen === "sugar")
                suitableDiets.push("https://schema.org/DiabeticDiet");
            });

          Array.isArray(recipe.categories) &&
            recipe.categories.forEach((category) => {
              if (category === "vegetarian")
                suitableDiets.push("https://schema.org/VegetarianDiet");
              if (category === "vegan")
                suitableDiets.push("https://schema.org/VeganDiet");
            });

          // Format categories
          const categories =
            (Array.isArray(recipe.categories) &&
              recipe.categories.join(", ")) ||
            "";
          const typeOfMeal =
            (Array.isArray(recipe.typeOfMeal) &&
              recipe.typeOfMeal.join(", ")) ||
            "";

          //Get general metadata
          const recipeMetaData = {
            url: `https://kokebokami.com/recipes/${path}`,
            name: recipe.title,
            description: recipe.description,
            keywords: categories,
            image: [recipe.photoURL || backupImg],
          };

          // Get comments count
          let commentsCount = 0;

          recipe.comments &&
            Object.entries(recipe.comments).forEach((comment) => {
              commentsCount++;
              if (comment[1].subComments) {
                commentsCount += Object.entries(comment[1].subComments).length;
              }
            });

          const rating =
            recipe.rating &&
            recipe.rating.reduce((a, b) => a + b, 0) / recipe.rating.length;
          const totalTime = getTotalTime(recipe.prepTime, recipe.cookingTime);

          // Complete structured data
          const structuredData = {
            "@context": "https://schema.org/",
            "@type": "Recipe",
            ...recipeMetaData,
            prepTime: getTimeString(recipe.prepTime),
            cookTime: getTimeString(recipe.cookingTime),
            totalTime: getTimeString(totalTime),
            datePublished: recipe.datePublished,
            dateModified: recipe.dateModified,
            recipeYield: recipe.servings || 4,
            recipeCategory: typeOfMeal,
            recipeCuisine: recipe.cuisine,
            recipeIngredient:
              (recipe.ingredients &&
                recipe.ingredients.map((ingredient) =>
                  ingredient.replace("NaN", "")
                )) ||
              [],
            recipeInstructions: instructions,
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/Comment",
              userInteractionCount: commentsCount,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: rating,
              ratingCount: (recipe.rating && recipe.rating.length) || 0,
            },
            suitableForDiet: suitableDiets,
            isAccessibleForFree: true,
            mainEntityOfPage: recipeMetaData.url,
            publisher: {
              "@type": "Organization",
              name: "kokebokami.com",
              logo: {
                "@type": "ImageObject",
                url: "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2Fkokebokami-assets%2FlogoK-round.png?alt=media&token=a018646d-0837-44cc-9a2c-01c251f5ec84",
                width: 500,
                height: 500,
              },
              sameAs: ["https://www.facebook.com/kokebokami"],
            },
          };

          recipeData.content = recipeModel(recipe, key);
          recipeData.metadata = metadata(recipeMetaData);
          recipeData.structuredData = structuredData;
        }
      }
    }
  } catch (error) {
    console.error("[getRecipeWithMetadata]", error.message);
  }

  return recipeData;
}

const metadata = (values) => {
  return {
    link: [
      {
        rel: "canonical",
        href: values.url,
      },
    ],
    meta: [
      {
        hid: "title",
        name: "title",
        content: values.name || "Kokebokami",
      },
      {
        hid: "description",
        name: "description",
        content:
          values.description || "No description available for this recipe",
      },
      {
        hid: "keywords",
        name: "keywords",
        content: values.keywords || "recipe, kokebokami",
      },
      {
        hid: "og:url",
        property: "og:url",
        content: values.url,
      },
      {
        hid: "og:type",
        property: "og:type",
        content: `article`,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: values.name || "Untitled recipe",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: values.description || "No description available",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: values.image[0],
      },
    ],
  };
};

function getTimeString(time) {
  return (
    time &&
    `PT${(time.h && time.h + "H") || ""}${(time.min && time.min + "M") || ""}`
  );
}
