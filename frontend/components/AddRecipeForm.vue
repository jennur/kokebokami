<template>
  <section class="mobile-width margin--auto margin-top--large">
    <form class="add-recipe-form" v-on:submit.prevent>
      <fieldset class="flex-column">
        <label>
          <input
            class="add-recipe-form__title"
            type="text"
            id="title"
            placeholder="Give your recipe a title"
            v-model="title"
          />
        </label>
        <label>
          <textarea
            class="add-recipe-form__description"
            id="description"
            placeholder="Say something about the recipe."
            v-model="description"
          />
        </label>
      </fieldset>

      <fieldset id="ingredientList" class="add-recipe-form__ingredients flex-column">
        <h4>Ingredients</h4>
        <span
          class="flex-row flex-row--align-center"
          v-for="ingredientNumber in ingredientNumberList"
          :key="ingredientNumber"
        >
          <label>
            <input
              class="add-recipe-form__ingredient"
              type="text"
              placeholder="Amount of something"
              :id="'ingredient' + ingredientNumber"
            />
          </label>

          <button
            :data-ingredient-ref="ingredientNumber"
            class="remove-icon"
            title="Remove ingredient"
            @click="(event)=>removeIngredient(event)"
          >
            <!--Remove ingredient-->
          </button>
        </span>
        <button
          class="add-recipe-form__add-input-btn margin-top--medium"
          @click="incrementIngredientNumber"
        >Add ingredient</button>
      </fieldset>

      <fieldset id="instructionList" class="flex-column">
        <h4>Instructions</h4>
        <ol class="add-recipe-form__instructions">
          <li
            class="margin-bottom--large"
            v-for="instructionStep in instructionStepList"
            :key="instructionStep"
          >
            <label>
              <span class="flex-row flex-row--align-center">
                <textarea
                  class="add-recipe-form__instruction"
                  placeholder="Explain what to do"
                  :id="'instruction' + instructionStep"
                />

                <button
                  :data-instruction-ref="instructionStep"
                  class="remove-icon"
                  title="Remove instruction step"
                  @click="(event)=>removeInstructionStep(event)"
                >Remove step</button>
              </span>
            </label>
          </li>
        </ol>

        <button
          class="add-recipe-form__add-input-btn margin-top--medium"
          @click="incrementInstructionStepsNumber"
        >Add step</button>
      </fieldset>

      <fieldset class="margin-top--large" v-if="!saved">
        <div class="flex-row flex-row--align-center flex-row--justify-center">
          <button class="button" @click="saveRecipe">Save recipe</button>
          <button class="button button--cancel" @click="cancel">✕ Cancel</button>
        </div>
      </fieldset>
    </form>
    <div class="system-message">{{ systemMessage }}</div>
    <nuxt-link v-if="recipeKey !== ''" :to="'/recipes/' + recipeKey">Look at your new recipe ➔</nuxt-link>
  </section>
</template>

<script>
import { user } from "~/mixins/getCurrentUser.js";
import { db } from "~/plugins/firebase.js";
export default {
  name: "add-recipe-form",
  components: {},
  mixins: [user],
  data() {
    return {
      title: "",
      description: "",
      systemMessage: "",
      saved: false,
      recipeKey: ""
    };
  },
  props: {
    ingredientNumberList: { type: Array, default: () => [1] },
    instructionStepList: { type: Array, default: () => [1] }
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
      let list = this.instructionStepList;
      let instructionStep = list.length === 0 ? 1 : Math.max.apply(null, list);
      this.instructionStepList.push(instructionStep + 1);
    },
    removeInstructionStep(event) {
      let instructionStep = event.target.getAttribute("data-instruction-ref");
      this.instructionStepList.splice(
        this.instructionStepList.indexOf(parseInt(instructionStep)),
        1
      );
    },
    cancel() {
      if (confirm("Are you sure you want to discard your new recipe?")) {
        this.$router.push("/account");
      }
    },
    saveRecipe() {
      let ingredients = document.querySelectorAll("#ingredientList input");
      let ingredientList = [];

      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].value) {
          ingredientList.push(ingredients[i].value);
        }
      }

      let instructions = document.querySelectorAll("#instructionList textarea");
      console.log("INSTRUCTIONS::: " + instructions);
      let instructionList = [];
      for (let i = 0; i < instructions.length; i++) {
        if (instructions[i].value) {
          instructionList.push(instructions[i].value);
        }
      }

      const recipes = db.ref("recipes");
      const newRecipeKey = recipes.push({
        title: this.title,
        ingredients: ingredientList,
        description: this.description,
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

