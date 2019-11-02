<template>
  <section class="mobile-width margin--auto">
    <div class="flex-row">
      <button
        class="button button--block button--small button--green-border margin-bottom--large margin-right--large"
        @click="pdfExport"
      >⤓ Download as PDF</button>
      <span
        role="button"
        @click="toggleShareBox"
        class="button button--small button--green-border margin-right--large"
      >
        <shareIcon class="recipe__share-icon margin-right--medium" />
        {{shareButtonText}}
      </span>

      <div v-if="recipeOwner">
        <button
          @click="toggleWarning"
          class="button button--small button--transparent"
        >{{editModeButtonText}}</button>
      </div>
    </div>
    <share-form v-if="sharing" :recipeKey="recipeKey" />

    <div v-if="!editMode" id="recipe" class="recipe">
      <div class="recipe__categories margin-top--large">
        <span
          class="recipe__category margin-right--large"
          v-for="category in recipe.categories"
          :key="category"
        >{{category}}</span>
      </div>
      <h2 class="recipe__title">{{recipe.title ? recipe.title : "Recipe has no title"}}</h2>
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
import { user } from "~/mixins/getCurrentUser.js";
import ShareForm from "~/components/ShareForm.vue";
import AddRecipeForm from "~/components/AddRecipeForm/AddRecipeForm.vue";
import * as jsPDF from "jspdf";
import logo from "~/assets/graphics/kokebokamilogo.png";
import shareIcon from "~/assets/graphics/shareicon.svg";

export default {
  name: "recipe-full-view",
  components: {
    ShareForm,
    AddRecipeForm,
    shareIcon
  },
  data() {
    return {
      recipeOwner: false,
      editMode: false,
      sharing: false,
      shareButtonText: "Share recipe"
    };
  },

  mixins: [user],
  computed: {
    recipeKey() {
      return this.$route.params.recipe;
    },
    recipe() {
      let userRecipes = this.$store.getters.recipes;
      let sharedRecipes = this.$store.getters.sharedRecipes;
      let allAvailableRecipes = userRecipes.concat(sharedRecipes);

      let currentRecipe = allAvailableRecipes.filter(recipe => {
        let recipeCheck = recipe[0] === this.recipeKey;
        if (recipeCheck) {
          this.recipeOwner = recipe[1].ownerID === this.user.id;
        }
        return recipeCheck;
      });
      //console.log("OWNER ID::: " + currentRecipe[0][0]);
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
    toggleWarning() {
      if (this.editMode) {
        if (confirm("Are you sure you want to discard the changes?")) {
          this.editMode = false;
        }
      } else {
        this.editMode = true;
      }
    },
    toggleShareBox() {
      this.sharing = !this.sharing;
      this.shareButtonText = this.sharing ? "Close share box" : "Share recipe";
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
