<template>
  <section class="mobile-width margin--auto margin-top--large">
    <form class="add-recipe-form" v-on:submit.prevent>
      <!-- TITLE / DESCRIPTION -->

      <fieldset class="flex-column">
        <title-component id="recipeTitle" />
        <description id="recipeDescription" />
      </fieldset>

      <!-- INGREDIENTS -->

      <fieldset id="ingredientList" class="add-recipe-form__ingredients flex-column">
        <h4>Ingredients</h4>
        <span
          class="flex-row flex-row--align-center margin-bottom--large"
          v-for="ingredientNumber in ingredientNumberList"
          :key="ingredientNumber"
        >
          <ingredient :id="'ingredient' + ingredientNumber" />
          <decrement-button
            :data-ingredient-ref="ingredientNumber"
            @decrement="(event)=>{removeIngredient(event)}"
          ></decrement-button>
        </span>
        <increment-button @increment="incrementIngredientNumber">Add ingredient</increment-button>
      </fieldset>

      <!-- INSTRUCTIONS -->

      <fieldset id="instructionList" class="flex-column">
        <h4>Instructions</h4>
        <ol class="add-recipe-form__instructions">
          <li
            class="margin-bottom--large"
            v-for="instructionStepNumber in instructionStepNumberList"
            :key="instructionStepNumber"
          >
            <instruction :id="'instruction' + instructionStepNumber" />
            <decrement-button
              :data-instruction-ref="instructionStepNumber"
              @decrement="(event) => removeInstructionStep(event)"
            ></decrement-button>
          </li>
          <increment-button @increment="incrementInstructionStepsNumber">Add step</increment-button>
        </ol>
      </fieldset>

      <!-- SAVE / UPDATE -->

      <fieldset class="margin-top--xxlarge" v-if="!saved">
        <save-section @save="saveRecipe" @cancel="cancel" />
      </fieldset>

      <div v-else-if="saved && recipeKey">
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
      recipeKey: ""
    };
  },
  props: {
    ingredientNumberList: { type: Array, default: () => [1] },
    instructionStepNumberList: { type: Array, default: () => [1] }
  },
  computed: {},
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
    incrementInstructionStepsNumber() {
      let list = this.instructionStepNumberList;
      let instructionStepNumber =
        list.length === 0 ? 1 : Math.max.apply(null, list);
      this.instructionStepNumberList.push(instructionStepNumber + 1);
    },
    removeInstructionStep(event) {
      let instructionStepNumber = event.target.getAttribute(
        "data-instruction-ref"
      );
      this.instructionStepNumberList.splice(
        this.instructionStepNumberList.indexOf(parseInt(instructionStepNumber)),
        1
      );
    },
    cancel() {
      if (confirm("Are you sure you want to discard your new recipe?")) {
        this.$router.push("/account");
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

      const recipes = db.ref("recipes");
      const newRecipeKey = recipes.push({
        title: recipeTitle.value,
        ingredients: ingredientList,
        description: recipeDescription.value,
        instructions: instructionList,
        ownerID: this.user.id
      }).key;

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
};
</script>

