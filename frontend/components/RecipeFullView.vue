<template>
  <section class="mobile-width margin--auto">
    <div class="flex-row">
      <button
        class="button button--block button--small button--green-border"
        @click="pdfExport"
      >⤓ Download as PDF</button>
      <div class="margin-left--large">
        <button @click="toggleEditMode" class="button button--transparent">{{editModeButtonText}}</button>
      </div>
    </div>

    <div v-if="!editMode" id="recipe" class="recipe">
      <h3 class="recipe__title">{{recipe.title ? recipe.title : "Recipe has no title"}}</h3>
      <div
        class="recipe__description"
      >{{recipe.description ? recipe.description : "Recipe has no description"}}</div>

      <h4 v-if="recipe.ingredients">Ingredients</h4>
      <ul class="recipe__ingredients" v-if="recipe.ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="ingredient">{{ingredient}}</li>
      </ul>
      <h4 v-if="recipe.instructions">Instructions</h4>

      <ol class="recipe__instructions">
        <li
          class="recipe__instructions-step"
          v-for="step in recipe.instructions"
          :key="step"
        >{{step ? step : "Recipe has no instructions"}}</li>
      </ol>
    </div>
    <div v-if="editMode">
      <add-recipe-form
        :existingRecipe="recipe"
        @exitEditMode="toggleEditMode"
        :editMode="editMode"
      />
    </div>
  </section>
</template>

<script>
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";
import * as jsPDF from "jspdf";
import logo from "~/assets/graphics/kokebokamilogo.png";

export default {
  name: "recipe-full-view",
  components: {
    AddRecipeForm
  },
  data() {
    return { editMode: false };
  },
  computed: {
    recipeKey() {
      return this.$route.params.recipe;
    },
    recipe() {
      let recipes = this.$store.getters.recipes;
      let currentRecipe = recipes.filter(recipe => {
        return recipe[0] === this.recipeKey;
      });
      return currentRecipe.length ? currentRecipe[0][1] : {};
    },
    editModeButtonText() {
      return this.editMode ? "Exit edit mode" : "Edit mode";
    }
  },

  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    pdfExport() {
      if (this.recipe.title !== undefined) {
        let recipe = document.getElementById("recipe");
        var doc = new jsPDF("p", "mm", "a4");
        var img = new Image();
        img.src = logo;
        doc.addImage(img, "PNG", 163, 10, 27, 5);

        let documentTitle = this.recipe.title.replace(/\s/g, "-").toLowerCase();
        doc.fromHTML(recipe, 20, 10, { width: "150" });
        doc.save("kokebokami_" + documentTitle + ".pdf");
      }
    }
  }
};
</script>
