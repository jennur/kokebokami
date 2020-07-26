<template>
  <section>
    <div ref="recipe" id="recipe" v-if="!editMode" class="recipe margin--auto">
      <div v-if="isRecipeOwner" class="text-align--right">
        <editIcon @click="toggleEditMode" class="recipe__edit-btn icon" />
      </div>
      <div class="recipe__details-wrap">
        <div
          v-if="recipe.photoURL"
          :style="`background-image: url(${recipe.photoURL})`"
          class="recipe__image"
        ></div>
        <div
          :class="{
            recipe__details: recipe.photoURL,
            'recipe__details--no-img': !recipe.photoURL
          }"
        >
          <type-of-meal-display
            v-if="recipe.typeOfMeal"
            :typeOfMeal="recipe.typeOfMeal"
            :class="`${recipe.freeFrom ? '' : 'margin-bottom--xlarge'}`"
          />
          <h2 class="recipe__title">{{ recipeTitle }}</h2>
          <div class="recipe__description">{{ description }}</div>
          <div id="ignorePDF">
            <category-display
              v-if="recipe.categories"
              :categories="recipe.categories"
              class="margin-bottom--xxlarge"
            />

            <free-from-display
              v-if="recipe.freeFrom"
              :freeFrom="recipe.freeFrom"
              class="margin-bottom--xlarge"
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

      <div class="recipe__flex-no-wrap flex-row--align-top margin-vertical--xlarge">
        <ingredients-display
          class="recipe__ingredients-wrap"
          v-if="recipe.ingredients"
          :ingredients="recipe.ingredients"
          :servings="recipe.servings || ''"
          :recipeTitle="recipeTitle"
        />

        <instructions-display
          class="recipe__instructions-wrap"
          v-if="recipe.instructions"
          :instructions="recipe.instructions"
        />
      </div>
    </div>

    <!-- EDIT FORM -->
    <transition name="fade">
      <div v-if="editMode">
        <add-recipe-form
          :existingRecipe="recipe"
          @exitEditMode="toggleEditMode"
          @update="handleUpdate"
          :editMode="editMode"
        />
      </div>
    </transition>
  </section>
</template>

<script>
import logo from "~/static/kokebokamilogo.png";
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import editIcon from "~/assets/graphics/icons/edit-icon.svg";

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
    editIcon,
    AddRecipeForm,
    ActionBar,
    CategoryDisplay,
    FreeFromDisplay,
    TypeOfMealDisplay,
    IngredientsDisplay,
    InstructionsDisplay,
    ExpandTransform
  },
  data() {
    return {
      editMode: false,
      hide: false
    };
  },
  props: {
    isRecipeOwner: { type: Boolean, default: false },
    recipeOwnerID: { type: String, default: "" },
    recipe: { type: Object, default: () => {} },
    recipeKey: { type: String, default: "" }
  },
  computed: {
    recipeTitle() {
      return this.recipe.title ? this.recipe.title : "Recipe has no title";
    },
    description() {
      return this.recipe.description
        ? this.recipe.description
        : "Recipe has no description";
    },
    editModeButtonText() {
      return this.editMode ? "Exit edit mode" : "Edit mode";
    }
  },
  methods: {
    handleUpdate() {
      this.$emit("update");
      this.toggleEditMode();
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (process.browser) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    },
    pdfExport() {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      let recipe = document.getElementById("recipe");
      let ignoreElement = document.getElementById("ignorePDF");
      recipe.removeChild(ignoreElement);
      let pdfContent = htmlToPdfMake(recipe.outerHTML);

      let documentTitle = this.recipe.title;
      let pdf = pdfMake.createPdf(pdfContent);
      let docDefinition = { content: [pdf.docDefinition[0]] };
      pdfMake
        .createPdf(docDefinition)
        .download(`${documentTitle}_kokebokami.pdf`);

      recipe.insertBefore(ignoreElement, recipe.childNodes[3]);
    }
  }
};
</script>
