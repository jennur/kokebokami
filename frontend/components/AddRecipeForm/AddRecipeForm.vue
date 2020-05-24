<template>
  <section class="margin--auto margin-top--xlarge">
    <form v-on:submit.prevent>
      <div class="recipes-filter__form">
        <category-filter
          :existingCategories="{ language, typeOfMeal, categories, freeFrom }"
          @setLanguage="updateLanguage"
          @setTypeOfMeal="updateTypeOfMeal"
          @setMealCategories="updateCategories"
          @setFreeFrom="updateFreeFrom"
        />
      </div>

      <div class="mobile-width margin-top--xlarge margin--auto">
        <!-- TITLE / DESCRIPTION -->
        <fieldset class="flex-column">
          <title-input
            id="recipeTitle"
            class="margin-bottom--medium"
            :existingTitle="title"
          />
          <description-input
            id="recipeDescription"
            class="margin-bottom--medium"
            :existingDescription="description"
          />
        </fieldset>

        <!-- INGREDIENTS -->
        <ingredients-input
          :existingIngredients="
            existingRecipe ? existingRecipe.ingredients : []
          "
        />

        <!-- INSTRUCTIONS -->
        <instructions-input
          :existingInstructions="
            existingRecipe ? existingRecipe.instructions : []
          "
        />

        <!-- PUBLIC CHECK -->
        <fieldset class="container">
          <label class="flex-row flex-row--align-center">
            <input type="checkbox" id="publicCheck" v-model="publicCheck" />
            <span class="margin-left--small"
              >Make recipe public (share with all users of Kokebokami)</span
            >
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
      </div>
    </form>
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import CategoryFilter from "~/components/CategoryFilter/CategoryFilter.vue";
import DescriptionInput from "~/components/Input/DescriptionInput.vue";

import IngredientsInput from "~/components/Input/IngredientsInput.vue";
import InstructionsInput from "~/components/Input/InstructionsInput.vue";
import SaveActions from "./Actions/SaveActions.vue";
import TitleInput from "~/components/Input/TitleInput.vue";

export default {
  name: "add-recipe-form",
  components: {
    CategoryFilter,
    DescriptionInput,
    IngredientsInput,
    InstructionsInput,
    SaveActions,
    TitleInput
  },
  props: {
    existingRecipe: { type: Object, default: () => null },
    editMode: { type: Boolean, default: false }
  },
  mixins: [user],
  data() {
    let existingRecipe = this.existingRecipe;
    return {
      recipeKey: this.$route.params.recipeid || "",
      title: (existingRecipe && existingRecipe.title) || "",
      description: (existingRecipe && existingRecipe.description) || "",
      language: (existingRecipe && existingRecipe.language) || "",
      categories: (existingRecipe && existingRecipe.categories) || [],
      freeFrom: (existingRecipe && existingRecipe.freeFrom) || [],
      typeOfMeal: (existingRecipe && existingRecipe.typeOfMeal) || [],
      publicCheck: (existingRecipe && existingRecipe.public) || false,
      systemMessage: "",
      saved: false,
      deleted: false
    };
  },
  methods: {
    updateLanguage(language) {
      this.language = language;
    },
    updateCategories(checked) {
      this.categories = checked;
    },
    updateFreeFrom(checked) {
      this.freeFrom = checked;
    },
    updateTypeOfMeal(typeOfMeal) {
      this.typeOfMeal = typeOfMeal;
    },

    cancel() {
      let confirmText = this.editMode
        ? "Are you sure you want to discard the changes?"
        : "Are you sure you want to discard your new recipe?";
      if (!this.editMode && confirm(confirmText)) {
        this.$router.push("/my-recipes/");
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
        const recipeRef = this.$fireDb.ref("recipes/" + this.recipeKey);
        recipeRef
          .remove()
          .then(() => {
            //this.$store.dispatch("SET_USER_RECIPES", this.user);
            this.systemMessage = "Your recipe was deleted successfully!";
            this.deleted = true;
          })
          .catch(error => {
            this.systemMessage = error.message;
            console.log("Error deleting recipe:", error);
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
        typeOfMeal: this.typeOfMeal,
        language: this.language,
        public: this.publicCheck,
        ownerID: this.user.id
      };

      if (this.recipeKey !== "") {
        const recipeRef = this.$fireDb.ref("recipes/" + this.recipeKey);
        recipeRef
          .update(recipeObject)
          .then(() => {
            this.$emit("update");
          })
          .catch(error => {
            this.systemMessage = error.message;
            console.log("Error saving recipe", error);
          });
      } else {
        const recipes = this.$fireDb.ref("recipes");
        const newRecipeKey = recipes.push(recipeObject).key;

        if (newRecipeKey !== null) {
          this.systemMessage = "Your recipe was saved successfully!";
          this.saved = true;
          this.recipeKey = newRecipeKey;
        } else
          this.systemMessage =
            "Unable to save recipe. Please try again later or contact us if the issue continues.";
      }
    }
  }
};
</script>
