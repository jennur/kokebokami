<template>
  <section>
    <div ref="recipe" id="recipe" class="recipe margin--auto">
      <public-note
        :isRecipeOwner="isRecipeOwner"
        :recipeKey="recipeKey"
        :isPublic="recipe.public"
        @update="$emit('update')"
      />

      <div class="recipe__details-wrap">
        <photo-display
          v-if="recipe.photoURL"
          :photoURL="recipe.photoURL"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="$emit('update')"
        />

        <div
          id="recipeDetails"
          :class="{
            recipe__details: recipe.photoURL,
            'recipe__details--no-img': !recipe.photoURL
          }"
        >
          <type-of-meal-display
            v-if="recipe.typeOfMeal"
            :typeOfMeal="recipe.typeOfMeal"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            :class="`${recipe.freeFrom ? '' : 'margin-bottom--xlarge'}`"
            @update="$emit('update')"
          />
          <free-from-display
            v-if="recipe.freeFrom"
            :freeFrom="recipe.freeFrom"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            class="margin-bottom--xlarge"
            @update="$emit('update')"
          />

          <title-display
            :title="recipe.title"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="$emit('update')"
          />
          <description-display
            :description="recipe.description"
            :isRecipeOwner="isRecipeOwner"
            :recipeKey="recipeKey"
            @update="$emit('update')"
          />

          <div id="ignorePDF">
            <category-display
              v-if="recipe.categories"
              :categories="Object.values(recipe.categories)"
              :isRecipeOwner="isRecipeOwner"
              :recipeKey="recipeKey"
              class="margin-bottom--xxlarge"
              @update="$emit('update')"
            />
            <action-bar
              :isRecipeOwner="isRecipeOwner"
              :recipeOwnerID="recipeOwnerID"
              :recipeKey="recipeKey"
              @download="pdfExport"
            />
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
          @update="$emit('update')"
        />

        <instructions-display
          class="recipe__instructions-wrap"
          :instructions="recipe.instructions"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="$emit('update')"
        />
      </div>
    </div>
  </section>
</template>

<script>
import logo from "~/static/kokebokamilogo.png";
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import PublicNote from "./Displays/PublicNote.vue";
import PhotoDisplay from "./Displays/PhotoDisplay.vue";
import TitleDisplay from "./Displays/TitleDisplay.vue";
import DescriptionDisplay from "./Displays/DescriptionDisplay.vue";

import AddRecipeForm from "~/components/Recipes/AddRecipeForm/AddRecipeForm.vue";
import ActionBar from "./Interaction/ActionBar.vue";
import CategoryDisplay from "./Displays/CategoryDisplay.vue";
import FreeFromDisplay from "./Displays/FreeFromDisplay";
import TypeOfMealDisplay from "./Displays/TypeOfMealDisplay";
import IngredientsDisplay from "./Displays/IngredientsDisplay.vue";
import InstructionsDisplay from "./Displays/InstructionsDisplay.vue";
import ExpandTransform from "~/components/Transitions/Expand.vue";

export default {
  name: "recipe-full-view",
  components: {
    PublicNote,
    PhotoDisplay,
    TitleDisplay,
    DescriptionDisplay,
    AddRecipeForm,
    ActionBar,
    CategoryDisplay,
    FreeFromDisplay,
    TypeOfMealDisplay,
    IngredientsDisplay,
    InstructionsDisplay,
    ExpandTransform
  },
  props: {
    isRecipeOwner: { type: Boolean, default: false },
    recipeOwnerID: { type: String, default: "" },
    recipe: { type: Object, default: () => {} },
    recipeKey: { type: String, default: "" }
  },
  data() {
    return {
      editMode: false,
      hide: false
    };
  },
  methods: {
    pdfExport() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      let recipe = document.getElementById("recipe");
      let recipeDetails = document.getElementById("recipeDetails");
      let ignoreElement = document.getElementById("ignorePDF");
      recipeDetails.removeChild(ignoreElement);
      let pdfContent = htmlToPdfMake(recipe.outerHTML);

      let documentTitle = this.recipe.title;
      let pdf = pdfMake.createPdf(pdfContent);
      let docDefinition = { content: [pdf.docDefinition[0]] };
      pdfMake
        .createPdf(docDefinition)
        .download(`${documentTitle}_kokebokami.pdf`);
      let childNodesLength = recipeDetails.childNodes.length;
      recipeDetails.insertBefore(
        ignoreElement,
        recipeDetails.childNodes[childNodesLength - 1]
      );
    }
  }
};
</script>
