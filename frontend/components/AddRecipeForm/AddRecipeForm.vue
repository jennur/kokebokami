<template>
  <section class="mobile-width margin--auto margin-top--xlarge">
    <form class="add-recipe-form" v-on:submit.prevent>
      <!-- TITLE / DESCRIPTION -->

      <fieldset class="flex-column">
        <title-component id="recipeTitle" class="margin-bottom--medium" :existingTitle="title" />
        <description
          id="recipeDescription"
          class="margin-bottom--medium"
          :existingDescription="description"
        />
      </fieldset>

      <!-- INGREDIENTS -->

      <fieldset id="ingredientList" class="add-recipe-form__ingredients flex-column">
        <h4>Ingredients</h4>
        <span
          class="flex-row flex-row--align-center margin-bottom--small"
          v-for="ingredientNumber in ingredientNumberList"
          :key="ingredientNumber"
        >
          <ingredient
            :id="'ingredient' + ingredientNumber"
            :existingIngredient="ingredients[ingredientNumber]"
          />
          <decrement-button
            :data-ingredient-ref="ingredientNumber"
            @decrement="(event)=>{removeIngredient(event)}"
          ></decrement-button>
        </span>
        <increment-button
          class="margin-top--large"
          @increment="incrementIngredientNumber"
        >Add ingredient</increment-button>
      </fieldset>

      <!-- INSTRUCTIONS -->

      <fieldset id="instructionList" class="flex-column">
        <h4>Instructions</h4>
        <ol class="add-recipe-form__instructions">
          <li
            class="margin-bottom--medium"
            v-for="instructionNumber in instructionNumberList"
            :key="instructionNumber"
          >
            <span class="flex-row flex-row--nowrap flex-row--align-center">
              <instruction
                :id="'instruction' + instructionNumber"
                :existingInstruction="instructions[instructionNumber]"
              />
              <decrement-button
                :data-instruction-ref="instructionNumber"
                @decrement="(event) => removeInstruction(event)"
              ></decrement-button>
            </span>
          </li>
        </ol>
        <increment-button class="margin-top--large" @increment="incrementInstructionNumber">Add step</increment-button>
      </fieldset>

      <fieldset class="container margin-top--xxlarge">
        <label>
          <input type="checkbox" id="publicCheck" v-model="publicCheck" /> Make recipe public (share with all users of Kokebokami)
        </label>
      </fieldset>
      <!-- SAVE / UPDATE -->

      <fieldset class="margin-top--xxlarge" v-if="!saved">
        <save-section
          v-if="!deleted"
          @save="saveRecipe"
          @cancel="cancel"
          @deleteRecipe="deleteRecipe"
          :editMode="editMode"
        />
        <div class="system-message">{{ systemMessage }}</div>
        <nuxt-link v-if="deleted" to="/account/my-recipes">Go back to your cook book</nuxt-link>
      </fieldset>

      <div
        class="flex-center-container flex-center-container--column margin--auto"
        v-else-if="saved && recipeKey"
      >
        <div class="system-message">{{ systemMessage }}</div>
        <nuxt-link v-if="recipeKey !== ''" :to="'/recipes/' + recipeKey">Look at your new recipe ➔</nuxt-link>
      </div>
    </form>
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import { db } from "~/plugins/firebase.js";
import TitleComponent from "./Input/TitleComponent.vue";
import Description from "./Input/Description.vue";
import Ingredient from "./Input/Ingredient.vue";
import Instruction from "./Input/Instruction.vue";
import SaveSection from "./Input/SaveSection.vue";
import IncrementButton from "./Input/IncrementButton.vue";
import DecrementButton from "./Input/DecrementButton.vue";

export default {
  name: "add-recipe-form",
  components: {
    TitleComponent,
    Description,
    Ingredient,
    Instruction,
    IncrementButton,
    DecrementButton,
    SaveSection
  },
  mixins: [user],
  data() {
    return {
      systemMessage: "",
      saved: false,
      recipeKey: "",
      title: "",
      description: "",
      ingredients: [],
      instructions: [],
      publicCheck: false,
      deleted: false
    };
  },
  props: {
    ingredientNumberList: { type: Array, default: () => [] },
    instructionNumberList: { type: Array, default: () => [] },
    existingRecipe: { type: Object, default: () => null },
    editMode: { type: Boolean, default: false }
  },
  computed: {},
  created: function() {
    let recipeKey = this.$route.params.recipe;
    if (this.existingRecipe !== null && recipeKey !== undefined) {
      this.recipeKey = recipeKey;
      let recipe = this.existingRecipe;

      if (recipe.title !== undefined) {
        this.title = recipe.title;
      }

      if (recipe.description !== undefined) {
        this.description = recipe.description;
      }

      if (recipe.public !== undefined) {
        this.publicCheck = recipe.public;
      }

      let counter = 0;

      if (recipe.ingredients !== undefined) {
        recipe.ingredients.forEach(ingredient => {
          this.ingredientNumberList.push(counter++);
          this.ingredients.push(ingredient);
        });
      }

      counter = 0;

      if (recipe.instructions !== undefined) {
        recipe.instructions.forEach(instruction => {
          this.instructionNumberList.push(counter++);
          this.instructions.push(instruction);
        });
      }
    }
  },
  methods: {
    incrementIngredientNumber() {
      let list = this.ingredientNumberList;
      let ingredientNumber = list.length === 0 ? 1 : Math.max.apply(null, list);
      this.ingredientNumberList.push(ingredientNumber + 1);
    },
    removeIngredient(event) {
      let ingredientNumber = event.target.getAttribute("data-ingredient-ref");
      this.ingredientNumberList.splice(
        this.ingredientNumberList.indexOf(parseInt(ingredientNumber)),
        1
      );
    },
    incrementInstructionNumber() {
      let list = this.instructionNumberList;
      let instructionNumber =
        list.length === 0 ? 1 : Math.max.apply(null, list);
      this.instructionNumberList.push(instructionNumber + 1);
    },
    removeInstruction(event) {
      let instructionNumber = event.target.getAttribute("data-instruction-ref");
      this.instructionNumberList.splice(
        this.instructionNumberList.indexOf(parseInt(instructionNumber)),
        1
      );
    },
    cancel() {
      let confirmText = this.editMode
        ? "Are you sure you want to discard the changes?"
        : "Are you sure you want to discard your new recipe?";
      if (confirm(confirmText)) {
        this.$router.push("/account/my-recipes");
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
            console.log(error);
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
            console.log(error);
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

