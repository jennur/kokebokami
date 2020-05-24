<template>
  <section>
    <div v-if="!editMode" id="recipe" class="recipe mobile-width margin--auto">
      <h2 class="recipe__title">{{ recipeTitle }}</h2>
      <div class="recipe__description">{{ description }}</div>
      <div id="ignorePDF">
        <category-display
          v-if="recipe.categories"
          :categories="recipe.categories"
          class="margin-bottom--xxlarge"
        />
        <type-of-meal-display
          v-if="recipe.typeOfMeal"
          :typeOfMeal="recipe.typeOfMeal"
          :class="`${recipe.freeFrom ? '' : 'margin-bottom--xlarge'}`"
        />
        <free-from-display
          v-if="recipe.freeFrom"
          :freeFrom="recipe.freeFrom"
          class="margin-bottom--xlarge"
        />

        <action-bar
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          :editMode="editMode"
          @edit="toggleEditMode"
          @download="pdfExport"
        />
      </div>

      <ingredients-display
        v-if="recipe.ingredients"
        :ingredients="recipe.ingredients"
      />
      <instructions-display
        v-if="recipe.instructions"
        :instructions="recipe.instructions"
      />
    </div>

    <!-- EDIT FORM -->
    <div v-if="editMode">
      <add-recipe-form
        :existingRecipe="recipe"
        @exitEditMode="toggleEditMode"
        @update="handleUpdate"
        :editMode="editMode"
      />
    </div>
  </section>
</template>

<script>
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";
import ActionBar from "./Interaction/ActionBar.vue";
import CategoryDisplay from "./Displays/CategoryDisplay.vue";
import FreeFromDisplay from "./Displays/FreeFromDisplay";
import TypeOfMealDisplay from "./Displays/TypeOfMealDisplay";
import IngredientsDisplay from "./Displays/IngredientsDisplay.vue";
import InstructionsDisplay from "./Displays/InstructionsDisplay.vue";
//import * as jsPDF from "jspdf";
import logo from "~/static/kokebokamilogo.png";

export default {
  name: "recipe-full-view",
  components: {
    AddRecipeForm,
    ActionBar,
    CategoryDisplay,
    FreeFromDisplay,
    TypeOfMealDisplay,
    IngredientsDisplay,
    InstructionsDisplay
  },
  data() {
    return {
      recipeOwnerID: "",
      editMode: false,
      hide: false
    };
  },
  props: {
    isRecipeOwner: { type: Boolean, default: false },
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
    },
    toggleWarning() {
      if (this.editMode) {
        if (confirm("Are you sure you want to discard the changes?")) {
          this.editMode = false;
        }
      } else {
        this.editMode = true;
      }
    },
    pdfExport() {
      if (this.recipe.title !== undefined) {
        var elementHandler = {
          "#ignorePDF": function(element, renderer) {
            return true;
          }
        };
        /* if (process.browser) {
          let recipe = document.getElementById("recipe");
          var doc = new jsPDF("p", "mm", "a4");
          var img = new Image();
          img.src = logo;
          doc.addImage(img, "PNG", 163, 10, 27, 5);

          let documentTitle = this.recipe.title
            .replace(/\s/g, "-")
            .toLowerCase();
          doc.fromHTML(recipe, 20, 10, {
            width: 150,
            elementHandlers: elementHandler
          });
          doc.save("kokebokami_" + documentTitle + ".pdf");
        } */
      }
    }
  }
};
</script>
