<template>
  <section>
    <div ref="recipe" id="recipe" class="recipe margin--auto">
      <div
        class="flex-row flex-row--align-center margin-bottom--medium"
        :class="{
          'flex-row--space-between': isRecipeOwner,
          'flex-row--justify-right': !isRecipeOwner
        }"
      >
        <settings-dropdown v-if="isRecipeOwner">
          <public-note
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            :isPublic="recipe.public"
            @update="payload => $emit('update', payload)"
          />
          <span v-if="recipeKey" class="system-message" @click="toggleAlert">
            <delete-icon tabindex="0" class="icon margin-left--small" />Delete
            recipe
          </span>
        </settings-dropdown>

        <div class="flex-row flex-row--align-center">
          <language-display
            v-if="isRecipeOwner"
            :language="recipe.language"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="payload => $emit('update', payload)"
          />
          <action-bar
            v-if="recipeKey"
            :isRecipeOwner="isRecipeOwner"
            :recipeOwnerID="recipeOwnerID"
            :recipeKey="recipeKey"
            :recipeTitle="recipe.title"
            :recipeDescription="recipe.description"
            :recipePublic="recipe.public"
            @download="pdfExport"
          />
        </div>
      </div>
      <Alert
        :alertMessage="
          `Are you sure you want to delete this recipe: ${recipe.title}? This operation cannot be undone.`
        "
        :showAlert="showAlert"
        @confirmed="deleteRecipe"
        @cancel="toggleAlert"
      />

      <div class="recipe__details-wrap">
        <photo-display
          :photoURL="recipe.photoURL"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="payload => $emit('update', payload)"
        />

        <div id="recipeDetails" class="recipe__details">
          <type-of-meal-display
            v-if="recipe.typeOfMeal || isRecipeOwner"
            :typeOfMeal="recipe && recipe.typeOfMeal"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="payload => $emit('update', payload)"
          />
          <free-from-display
            v-if="recipe.freeFrom || isRecipeOwner"
            :freeFrom="recipe && recipe.freeFrom"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            class="margin-bottom--xlarge"
            @update="payload => $emit('update', payload)"
          />

          <title-display
            :title="recipe.title"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="payload => $emit('update', payload)"
          />
          <description-display
            :description="recipe.description"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="payload => $emit('update', payload)"
          />

          <category-display
            v-if="recipe.categories || isRecipeOwner"
            :categories="recipe.categories && Object.values(recipe.categories)"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            class="margin-bottom--xxlarge"
            @update="payload => $emit('update', payload)"
          />

          <div
            v-if="!isRecipeOwner"
            class="recipe__category-note margin-bottom--large text-align--right"
          >
            Written by
            <nuxt-link :to="`/cooks/${recipe.ownerID}`">{{
              recipeOwnerDisplayName
            }}</nuxt-link>
          </div>
        </div>
      </div>

      <div
        class="recipe__flex-no-wrap flex-row--align-top margin-vertical--xlarge"
      >
        <ingredients-display
          class="recipe__ingredients-wrap"
          :ingredients="recipe.ingredients"
          :servings="recipe.servings || ''"
          :recipeTitle="recipe.title"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="payload => $emit('update', payload)"
        />

        <instructions-display
          class="recipe__instructions-wrap"
          :instructions="recipe.instructions"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="payload => $emit('update', payload)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import logo from "~/static/kokebokamilogo.png";
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "~/assets/fonts/vfs_fonts";

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

export default {
  name: "recipe-full-view",
  components: {
    SettingsDropdown,
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
    Alert
  },
  props: {
    isRecipeOwner: { type: Boolean, default: false },
    recipeOwnerID: { type: String, default: "" },
    recipeOwnerDisplayName: { type: String, default: "Unknown" },
    recipe: { type: Object, default: () => {} },
    recipeKey: { type: String, default: "" }
  },
  data() {
    return {
      editMode: false,
      hide: false,
      showAlert: false
    };
  },
  methods: {
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
      let ingredients =
        Array.isArray(recipe.ingredients) &&
        recipe.ingredients
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

      let recipeHTML = `<div style="margin: 30px;">
      <span style="font-family:'delius';font-size:20px;color:#ff7300;text-align:right;">Kokebokami</span>
      <h1 style="color:#063c60;margin-top: 30px; margin-bottom: 20px;">${recipe.title}</h1>
      <p style="color:#063c60;font-size:20px;">${recipe.description}</p>
      <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Meal type: </strong> ${typeOfMeal}</span>
      <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Free from:</strong> ${freeFrom}</span>
      <span style="color:#063c60;margin-bottom:5px;margin-top:0px;"><strong>Categories:</strong> ${categories}</span>
      <h6 style="color:#063c60;margin-top: 35px; margin-bottom: 10px;">Ingredients</h6>
      <ul style="margin-bottom: 15px;">${ingredients}</ul>
      <h6 style="color:#063c60;margin-top: 25px; margin-bottom: 10px;">Instructions</h6>
      <ol>${instructions}</ol>
      <a style="margin-top:30px;" href="https://kokebokami.com">kokebokami.com</a>
      </div>`;

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
      let photoRef = this.$fireDb.ref(`recipes/${this.recipeKey}/photoURL`);
      return photoRef.once("value", snapshot => {
        if (snapshot.exists()) {
          let photoURL = snapshot.val();
          if (photoURL !== "") {
            var fileRef = this.$fireStorage.refFromURL(photoURL);
            fileRef
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
      let recipeKey = this.recipeKey;
      if (recipeKey) {
        this.deleteRecipeImageFromStorage().then(() => {
          const recipeRef = this.$fireDb.ref(`recipes/${recipeKey}`);
          recipeRef
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
  }
};
</script>
