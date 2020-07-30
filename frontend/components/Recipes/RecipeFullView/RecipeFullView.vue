<template>
  <section>
    <div ref="recipe" id="recipe" class="recipe margin--auto">
      <settings-dropdown v-if="isRecipeOwner">
        <public-note
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          :isPublic="recipe.public"
          @update="payload => $emit('update', payload)"
        />
        <span v-if="recipeKey" @click="toggleAlert">
          <delete-icon tabindex="0" class="icon margin-left--small" />
          Delete recipe
        </span>
      </settings-dropdown>
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

          <div id="ignorePDF">
            <category-display
              v-if="recipe.categories || isRecipeOwner"
              :categories="
                recipe.categories && Object.values(recipe.categories)
              "
              :isRecipeOwner="isRecipeOwner"
              :recipeKey="recipeKey"
              class="margin-bottom--xxlarge"
              @update="payload => $emit('update', payload)"
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
import pdfFonts from "pdfmake/build/vfs_fonts";

import SettingsDropdown from "~/components/SettingsDropdown.vue";
import PublicNote from "./Displays/PublicNote.vue";
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
    },
    deleteRecipe() {
      const recipeRef = this.$fireDb.ref("recipes/" + this.recipeKey);
      recipeRef
        .remove()
        .then(() => {
          this.$router.push("/account/my-cookbook/");
        })
        .catch(error => {
          this.systemMessage = error.message;
          console.log("Error deleting recipe:", error.message);
        });
    }
  }
};
</script>
