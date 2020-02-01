<template>
  <section class="mobile-width margin--auto margin-top--xlarge">
    <form class="add-recipe-form" v-on:submit.prevent>
      <!-- LANGUAGE -->
      <language-input :existingLanguage="language" @language="updateLanguage" />

      <!-- CATEGORIES -->
      <categories-input
        id="categories"
        class="margin-bottom--xlarge"
        :existingCategories="categories"
        @update="updateCategories"
      />

      <!-- FREE FROM -->
      <free-from-input
        id="freeFrom"
        class="margin-bottom--xlarge"
        :existingFreeFrom="freeFrom"
        @update="updateFreeFrom"
      />

      <!-- TITLE / DESCRIPTION -->
      <fieldset class="flex-column">
        <title-input id="recipeTitle" class="margin-bottom--medium" :existingTitle="title" />
        <description-input
          id="recipeDescription"
          class="margin-bottom--medium"
          :existingDescription="description"
        />
      </fieldset>

      <!-- INGREDIENTS -->
      <ingredients-input :existingIngredients="existingRecipe ? existingRecipe.ingredients : []" />

      <!-- INSTRUCTIONS -->
      <instructions-input
        :existingInstructions="existingRecipe ? existingRecipe.instructions : []"
      />

      <!-- PUBLIC CHECK -->
      <fieldset class="container">
        <label>
          <input type="checkbox" id="publicCheck" v-model="publicCheck" /> Make
          recipe public (share with all users of Kokebokami)
        </label>
      </fieldset>

      <!-- SAVE / UPDATE -->
      <save-actions
        :recipeKey="recipeKey"
        :deleted="deleted"
        :saved="saved"
        :editMode="editMode"
        :systemMessage="systemMessage"
        @save="saveRecipe"
        @cancel="cancel"
        @deleteRecipe="deleteRecipe"
      />
    </form>
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import { db } from "~/plugins/firebase.js";
import CategoriesInput from "./Input/CategoriesInput.vue";
import DescriptionInput from "./Input/DescriptionInput.vue";
import FreeFromInput from "./Input/FreeFromInput.vue";
import IngredientsInput from "./Input/IngredientsInput.vue";
import InstructionsInput from "./Input/InstructionsInput.vue";
import LanguageInput from "./Input/LanguageInput.vue";
import SaveActions from "./Actions/SaveActions.vue";
import TitleInput from "./Input/TitleInput.vue";

export default {
  name: "add-recipe-form",
  components: {
    CategoriesInput,
    DescriptionInput,
    FreeFromInput,
    IngredientsInput,
    InstructionsInput,
    LanguageInput,
    SaveActions,
    TitleInput
  },
  mixins: [user],
  data() {
    return {
      categories: [],
      deleted: false,
      description: "",
      freeFrom: [],
      language: "",
      publicCheck: false,
      recipeKey: "",
      systemMessage: "",
      saved: false,
      title: ""
    };
  },
  props: {
    existingRecipe: { type: Object, default: () => null },
    editMode: { type: Boolean, default: false }
  },
  created: function() {
    let recipeKey = this.$route.params.recipeid;
    if (this.existingRecipe !== null && recipeKey !== undefined) {
      this.recipeKey = recipeKey;
      let recipe = this.existingRecipe;

      if (recipe.title !== undefined) this.title = recipe.title;
      if (recipe.description !== undefined)
        this.description = recipe.description;
      if (recipe.public !== undefined) this.publicCheck = recipe.public;
      if (recipe.language !== undefined) this.language = recipe.language;
      if (recipe.categories !== undefined) this.categories = recipe.categories;
      if (recipe.freeFrom !== undefined) this.freeFrom = recipe.freeFrom;
      if (recipe.typeOfMeal !== undefined) this.typeOfMeal = recipe.typeOfMeal;
    }
  },
  methods: {
    updateCategories(checked) {
      this.categories = checked;
    },
    updateFreeFrom(checked) {
      this.freeFrom = checked;
    },
    updateLanguage(language) {
      this.language = language;
    },
    cancel() {
      let confirmText = this.editMode
        ? "Are you sure you want to discard the changes?"
        : "Are you sure you want to discard your new recipe?";
      if (!this.editMode && confirm(confirmText)) {
        this.$router.push("/my-recipes");
      } else if (this.editMode && confirm(confirmText)) {
        this.$emit("exitEditMode");
      }
    },
    deleteRecipe() {
      if (
        confirm(
          "Are you sure you want to delete this recipe? This operation cannot be undone."
        )
      ) {
        const recipeRef = db.ref("recipes/" + this.recipeKey);
        recipeRef
          .remove()
          .then(() => {
            this.$store.dispatch("SET_USER_RECIPES", this.user);
            this.systemMessage = "Your recipe was deleted successfully!";
            this.deleted = true;
          })
          .catch(error => {
            this.systemMessage = error.message;
            console.log("ERROR DELETING RECIPE::: " + error);
          });
      }
    },
    saveRecipe() {
      const recipeTitle = document.querySelector("#recipeTitle input");
      const recipeDescription = document.querySelector(
        "#recipeDescription textarea"
      );

      let ingredients = document.querySelectorAll("#ingredientList input");
      let ingredientList = [];
      ingredients.forEach(ingredient => {
        ingredientList.push(ingredient.value);
      });

      let instructions = document.querySelectorAll("#instructionList textarea");
      let instructionList = [];
      instructions.forEach(instruction => {
        instructionList.push(instruction.value);
      });

      let recipeObject = {
        title: recipeTitle.value,
        ingredients: ingredientList,
        description: recipeDescription.value,
        instructions: instructionList,
        categories: this.categories,
        freeFrom: this.freeFrom,
        language: this.language,
        public: this.publicCheck,
        ownerID: this.user.id
      };

      if (this.recipeKey !== "") {
        const recipeRef = db.ref("recipes/" + this.recipeKey);
        recipeRef
          .update(recipeObject)
          .then(() => {
            this.$emit("exitEditMode");
            this.$store.dispatch("SET_USER_RECIPES", this.user);
          })
          .catch(error => {
            this.systemMessage = error.message;
            console.log("ERROR SAVING RECIPE::: " + error);
          });
      } else {
        const recipes = db.ref("recipes");
        const newRecipeKey = recipes.push(recipeObject).key;

        if (newRecipeKey !== null) {
          this.$store.dispatch("SET_USER_RECIPES", this.user);
          this.systemMessage = "Your recipe was saved successfully!";
          this.saved = true;
          this.recipeKey = newRecipeKey;
        } else
          this.systemMessage =
            "Unable to save recipe. Try again later or contact support if issue continues.";
      }
    }
  }
};
</script>
