<template>
  <div>
    <!-- <label
      class="flex-row flex-row--align-center flex-row--nowrap margin-top--xxlarge"
    >
      <h4 class="margin--none">Number of servings:</h4>
      <input
        class="add-recipe-form__servings margin-left--medium"
        type="number"
        id="servings-amount"
        placeholder="4"
        min="0"
        step="1"
        v-model="servings"
      />
    </label> -->
    <fieldset
      id="ingredientList"
      class="add-recipe-form__ingredients flex-column margin-top--xxlarge"
    >
      <h4>Ingredients</h4>

      <div
        v-if="ingredientNumbers.length"
        class="add-recipe-form__ingredient-heading flex-row flex-row--space-between flex-row--nowrap margin-bottom--medium"
      >
        <span>Amount</span>
        <span>Ingredient</span>
      </div>
      <div
        class="flex-row flex-row--align-center flex-row--nowrap margin-bottom-sm"
        v-for="number in ingredientNumbers"
        :key="number"
      >
        <div
          class="add-recipe-form__ingredient-wrap flex-row flex-row--space-between flex-row--nowrap"
        >
          <label>
            <input
              class="add-recipe-form__amount"
              type="number"
              :id="`ingredient-amount-${number}`"
              :placeholder="(number % 2 && '3') || (number % 3 && '100') || '2'"
              min="0"
              step=".05"
              v-model="ingredientAmounts[number]"
            />
          </label>
          <label>
            <input
              class="add-recipe-form__ingredient"
              type="text"
              :placeholder="
                (number % 2 && 'dl milk') || (number % 3 && 'g sugar') || 'eggs'
              "
              :id="'ingredient' + number"
              v-model="ingredients[number]"
            />
          </label>
        </div>

        <decrement-button
          :data-ingredient-ref="number"
          @decrement="
            event => {
              removeIngredient(event.target);
            }
          "
        ></decrement-button>
      </div>
      <div class="flex-row flex-row--align-center">
        <increment-button
          class="margin-top--large margin-right--large"
          @increment="incrementIngredientNumber"
          >Add ingredient</increment-button
        ><button
          class="button button--dynamic-small button--round padding-vertical-sm margin-top--large"
          @click="$emit('save', [ingredientAmounts, ingredients])"
        >
          Save
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script>
import IncrementButton from "./IncrementButton.vue";
import DecrementButton from "./DecrementButton.vue";

export default {
  name: "ingredients-input",
  components: {
    IncrementButton,
    DecrementButton
  },
  data() {
    return { servings: "", ingredientAmounts: [], ingredients: [] };
  },
  props: {
    existingIngredients: {
      type: Array,
      default: () => []
    },
    existingServings: {
      type: String,
      default: ""
    },
    ingredientNumbers: { type: Array, default: () => [] }
  },
  methods: {
    incrementIngredientNumber() {
      let numbers = this.ingredientNumbers;
      let ingredientNumber =
        numbers.length === 0 ? 1 : Math.max.apply(null, numbers);
      this.ingredientNumbers.push(ingredientNumber + 1);
    },
    removeIngredient(target) {
      let ingredientNumber = target.getAttribute("data-ingredient-ref");
      this.ingredientNumbers.splice(
        this.ingredientNumbers.indexOf(parseInt(ingredientNumber)),
        1
      );
    }
  },
  mounted() {
    let counter = 0;
    let amountReg = /^\d+$/;
    if (this.existingServings !== undefined) {
      this.servings = this.existingServings;
    }
    if (this.existingIngredients !== undefined) {
      this.existingIngredients.forEach(ingredient => {
        this.ingredientNumbers.push(counter++);

        let amount = ingredient.match(/(?:\d+|\d(?:,\d)+)(?:(\.|,)\d+)?/);

        if (amount && amount.length) {
          let ingredientItem = ingredient.replace(amount[0], "");
          amount = amount.map(Number)[0];
          this.ingredientAmounts.push(amount);
          this.ingredients.push(ingredientItem);
        } else {
          this.ingredientAmounts.push("");
          this.ingredients.push(ingredient);
        }
      });
    }
  }
};
</script>
