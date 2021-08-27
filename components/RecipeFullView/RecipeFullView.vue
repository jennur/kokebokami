<template>
  <section>
    <div ref="recipe" id="recipe" class="recipe margin-auto">
      <div
        class="flex-row flex-row--align-center flex-row--space-between margin-bottom-md"
      >
      <div class="flex-row flex-row--align-center">
        <settings-dropdown v-if="isRecipeOwner">
          <public-note
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            :isPublic="recipe.public"
            @update="payload => $emit('update', payload)"
          />
          <span v-if="recipe.id" class="system-message" @click="toggleAlert">
            <delete-icon tabindex="0" class="icon margin-right-sm" />{{
              $t("recipes.deleteRecipe")
            }}
          </span>
        </settings-dropdown>
        <rating v-if="recipe.id" :rating="recipe.rating" :recipeKey="recipe.id" :show-total-votes="true" />
        <add-to-favorites v-if="recipe.id" :recipe-key="recipe.id" :favorites-count="recipe.favoritesCount" :show-count="true"/>
      </div>

        <div class="flex-row flex-row--align-center">

          <action-bar
            v-if="recipe.id"
            :isRecipeOwner="isRecipeOwner"
            :recipeOwnerID="recipe.ownerID"
            :recipeKey="recipe.id"
            :recipeTitle="recipe.title"
            :recipeDescription="recipe.description"
            :recipePublic="recipe.public"
            @download="pdfExport"
          />
        </div>
      </div>
      <Alert
        :alertMessage="
          `${$t('recipes.deleteAlert.beforeTitle')}: ${recipe.title}?
          ${$t('recipes.deleteAlert.afterTitle')}.`
        "
        :showAlert="showAlert"
        @confirmed="deleteRecipe"
        @cancel="toggleAlert"
      />

      <div class="recipe_details-wrap">
        <photo-display
          :photoURL="recipe.photoURL"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="payload => $emit('update', payload)"
        />

        <div id="recipeDetails" class="recipe_details">
          <language-display
            class="margin-right-xl"
            v-if="isRecipeOwner"
            :language="recipe.language"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            @update="payload => $emit('update', payload)"
          />
          <type-of-meal-display
            v-if="recipe.typeOfMeal || isRecipeOwner"
            :typeOfMeal="recipe && recipe.typeOfMeal"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            @update="payload => $emit('update', payload)"
          />
          <free-from-display
            v-if="recipe.freeFrom || isRecipeOwner"
            :freeFrom="recipe && recipe.freeFrom"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            class="margin-bottom-xl"
            @update="payload => $emit('update', payload)"
          />

          <title-display
            :title="recipe.title"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            @update="payload => $emit('update', payload)"
          />
          <description-display
            :description="recipe.description"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            @update="payload => $emit('update', payload)"
          />

          <category-display
            v-if="recipe.categories || isRecipeOwner"
            :categories="recipe.categories && Object.values(recipe.categories)"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipe.id"
            class="margin-bottom-2xl"
            @update="payload => $emit('update', payload)"
          />

          <div
            v-if="!isRecipeOwner"
            class="recipe_category-note margin-bottom-lg text-align--right"
          >
            {{ $t("recipes.publishedBy") }}
            <nuxt-link :to="localePath(`/cooks/${author && author.path}`)">
            {{ author && author.displayName }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <div v-if="recipe.datePublished" class="recipe_dates margin-top-xl">
        <div>
          <span class="label">Published:</span>
          {{recipe.datePublished}}
        </div>
        <div v-if="recipe.dateModified">
          <span class="label">Updated:</span>
          {{recipe.dateModified}}
        </div>
      </div>

      <div class="main-content-wrap margin-v-xl">
        <ingredients-display
          class="recipe_ingredients-wrap"
          :ingredients="recipe.ingredients"
          :servings="recipe.servings || ''"
          :recipeTitle="recipe.title"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="payload => $emit('update', payload)"
          @calculated-ingredients="setCalculatedIngredients"
        />

        <instructions-display
          class="recipe_instructions-wrap"
          :instructions="recipe.instructions"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipe.id"
          @update="payload => $emit('update', payload)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "assets/fonts/vfs_fonts";

import Rating from "./Interaction/Rating.vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";
import PublicNote from "./Displays/PublicNote.vue";
import LanguageDisplay from "./Displays/LanguageDisplay.vue";
import PhotoDisplay from "./Displays/PhotoDisplay.vue";
import TitleDisplay from "./Displays/TitleDisplay.vue";
import DescriptionDisplay from "./Displays/DescriptionDisplay.vue";
import CategoryDisplay from "./Displays/CategoryDisplay.vue";
import FreeFromDisplay from "./Displays/FreeFromDisplay";
import TypeOfMealDisplay from "./Displays/TypeOfMealDisplay";
import IngredientsDisplay from "./Displays/IngredientsDisplay.vue";
import InstructionsDisplay from "./Displays/InstructionsDisplay.vue";

import ActionBar from "./Interaction/ActionBar.vue";
import Alert from "~/components/Alert.vue";
import ExpandTransform from "~/components/Transitions/Expand.vue";
import AddToFavorites from './Interaction/AddToFavorites.vue';


export default {
  name: "recipe-full-view",
  components: {
    SettingsDropdown,
    Rating,
    PublicNote,
    LanguageDisplay,
    PhotoDisplay,
    TitleDisplay,
    DescriptionDisplay,
    ActionBar,
    CategoryDisplay,
    FreeFromDisplay,
    TypeOfMealDisplay,
    IngredientsDisplay,
    InstructionsDisplay,
    ExpandTransform,
    Alert,
    AddToFavorites
  },
  props: {
    isRecipeOwner: { type: Boolean, default: false },
    recipe: { type: Object, default: () => {} },
    author: { type: Object, default: () => {} }
  },
  data() {
    return {
      editMode: false,
      hide: false,
      showAlert: false,
      calculatedIngredients: {}
    };
  },
  methods: {
    setCalculatedIngredients(ingredientsObj) {
      this.calculatedIngredients = ingredientsObj;
    },
    toggleAlert() {
      this.showAlert = !this.showAlert;
    },
    pdfExport() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      let recipe = this.recipe;
      let categories = Array.isArray(recipe.categories)
        ? recipe.categories.join(", ")
        : recipe.categories;

      let typeOfMeal = Array.isArray(recipe.typeOfMeal)
        ? recipe.typeOfMeal.join(", ")
        : recipe.typeOfMeal;
      let freeFrom = Array.isArray(recipe.freeFrom)
        ? recipe.freeFrom.join(", ")
        : recipe.freeFrom;

      let calculatedIngredients = this.calculatedIngredients;

      let ingredients =
        calculatedIngredients && calculatedIngredients.ingredients;

      let servings =
        (calculatedIngredients && calculatedIngredients.servings) ||
        recipe.servings;

      if (ingredients) {
        ingredients = ingredients.map(ingredient => {
          return `${ingredient.amount} ${ingredient.item}`;
        });
      } else ingredients = recipe.ingredients;

      ingredients =
        Array.isArray(ingredients) &&
        ingredients
          .map(ingredient => {
            return `<li style="margin-bottom: 5px;">${ingredient}</li>`;
          })
          .join("");

      let instructions =
        Array.isArray(recipe.instructions) &&
        recipe.instructions
          .map(instruction => {
            return `<li style=""><p style="">${instruction}</p></li>`;
          })
          .join("");

      let recipeHTML = `
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

      let pdfContent = htmlToPdfMake(recipeHTML);

      let documentTitle = recipe.title;
      pdfMake.fonts = {
        delius: {
          normal: "Delius-Regular.ttf"
        },
        bevietnam: {
          normal: "BeVietnam-Regular.ttf",
          bold: "BeVietnam-ExtraBold.ttf"
        }
      };
      let pdf = pdfMake.createPdf(pdfContent);
      let docDefinition = {
        content: [pdf.docDefinition[0]],
        defaultStyle: {
          font: "bevietnam"
        }
      };
      pdfMake
        .createPdf(docDefinition)
        .download(`${documentTitle}_kokebokami.pdf`);
    },
    deleteRecipeImageFromStorage() {
      return this.$fire.database
        .ref(`recipes/${this.recipe.id}/photoURL`)
        .once("value", snapshot => {
          if (snapshot.exists()) {
            let photoURL = snapshot.val();
            if (photoURL !== "") {
              this.$fire.storage
                .refFromURL(photoURL)
                .delete()
                .then(() => {
                  console.log("Successfully deleted image");
                })
                .catch(error =>
                  console.log("Error deleting file:", error.message)
                );
            }
          }
        });
    },
    deleteRecipe() {
      if (this.recipe.id) {
        this.deleteRecipeImageFromStorage().then(() => {
          this.$fire.database
            .ref(`recipes/${this.recipe.id}`)
            .remove()
            .then(() => {
              this.$router.push("/account/my-cookbook/");
            })
            .catch(error => {
              this.systemMessage = error.message;
              console.log("Error deleting recipe:", error.message);
            });
        });
      }
    }
  },
  // mounted(){
  //   this.getRecipeAuthor(this.recipe.ownerID);
  // }
};
</script>
