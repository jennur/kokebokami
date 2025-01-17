import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "assets/fonts/vfs_fonts";

export default function pdfExport(recipe, calcValues) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const categories = Array.isArray(recipe.categories)
    ? recipe.categories.join(", ")
    : recipe.categories;

  const typeOfMeal = Array.isArray(recipe.typeOfMeal)
    ? recipe.typeOfMeal.join(", ")
    : recipe.typeOfMeal;
  const freeFrom = Array.isArray(recipe.freeFrom)
    ? recipe.freeFrom.join(", ")
    : recipe.freeFrom;

  const calcIngredients =
    (Array.isArray(calcValues?.ingredients) &&
      calcValues?.ingredients?.map((ingredient) => {
        return `${ingredient?.amount || '-'} ${ingredient?.item || 'missing'}`;
      })) ||
    recipe.ingredients;

  const ingredients = calcIngredients
    .map((ingredient) => {
      return `<li style="margin-bottom: 5px;">${ingredient}</li>`;
    })
    .join("");

  const servings = calcValues?.servings || recipe.servings;

  const instructions =
    Array.isArray(recipe.instructions) &&
    recipe.instructions
      .map((instruction) => {
        return `<li style=""><p style="">${instruction}</p></li>`;
      })
      .join("");

  const recipeHTML = `
      <div style="margin: 30px;">
        <span style="font-size:20px;color:#ff7300;text-align:right;">Kokebokami</span>
        <h1 style="color:#063c60;margin-top: 30px; margin-bottom: 20px;">${recipe.title}</h1>
        <p style="color:#063c60;font-size:20px;">${recipe.description}</p>
        <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Meal type: </strong> ${typeOfMeal}</span>
        <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Free from:</strong> ${freeFrom}</span>
        <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Categories:</strong> ${categories}</span>
        <h6 style="color:#063c60;margin-top: 35px; margin-bottom: 10px;">Servings:</h6>
        <div>${servings}</div>
        <h6 style="color:#063c60;margin-top: 35px; margin-bottom: 10px;">Ingredients</h6>
        <ul style="margin-bottom: 15px;">${ingredients}</ul>
        <h6 style="color:#063c60;margin-top: 25px; margin-bottom: 10px;">Instructions</h6>
        <ol>${instructions}</ol>
        <a style="margin-top:30px;" href="https://kokebokami.com">kokebokami.com</a>
      </div>
      `;

  const pdfContent = htmlToPdfMake(recipeHTML);

  const documentTitle = recipe.title;
  pdfMake.fonts = {
    delius: {
      normal: "Delius-Regular.ttf",
    },
    bevietnam: {
      normal: "BeVietnam-Regular.ttf",
      bold: "BeVietnam-ExtraBold.ttf",
    },
  };
  const pdf = pdfMake.createPdf(pdfContent);
  const docDefinition = {
    content: [pdf.docDefinition[0]],
    defaultStyle: {
      font: "bevietnam",
    },
  };
  pdfMake.createPdf(docDefinition).download(`${documentTitle}_kokebokami.pdf`);
}
