<template
  ><div>
    <label
      class="flex-row flex-row--align-center flex-row--nowrap margin-top--xxlarge"
    >
      <h4 class="margin--none">Number of servings:</h4>
      <input
        class="add-recipe-form__amount margin-left--medium"
        type="number"
        id="servings-amount"
        placeholder="4"
        min="0"
        step="1"
        v-model="servings"
      />
    </label>
    <fieldset
      id="ingredientList"
      class="add-recipe-form__ingredients flex-column margin-top--xxlarge"
    >
      <h4>Ingredients</h4>
      <div
        class="add-recipe-form__ingredient-heading flex-row flex-row--space-between flex-row--nowrap margin-bottom--medium"
      >
        <span>Amount</span>
        <span>Measurement unit & ingredient</span>
      </div>
      <span
        class="flex-row flex-row--align-center flex-row--nowrap margin-bottom--small"
        v-for="number in ingredientNumbers"
        :key="number"
      >
        <label
          class="add-recipe-form__ingredient-wrap flex-row flex-row--space-between flex-row--nowrap"
        >
          <input
            class="add-recipe-form__amount"
            type="number"
            :id="`ingredient-amount-${number}`"
            :placeholder="(number % 2 && '3') || (number % 3 && '100') || '2'"
            min="0"
            step=".05"
            v-model="ingredientAmounts[number]"
          />

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

        <decrement-button
          :data-ingredient-ref="number"
          @decrement="
            event => {
              removeIngredient(event.target);
            }
          "
        ></decrement-button>
      </span>
      <increment-button
        class="margin-top--large"
        @increment="incrementIngredientNumber"
        >Add ingredient</increment-button
      >
    </fieldset>
  </div>
</template>

<script>
import IncrementButton from "~/components/AddRecipeForm/Actions/IncrementButton.vue";
import DecrementButton from "~/components/AddRecipeForm/Actions/DecrementButton.vue";

export default {
  name: "ingredients-input",
  components: {
    IncrementButton,
    DecrementButton
  },
  data() {
    return { servings: 4, ingredientAmounts: [], ingredients: [] };
  },
  props: {
    existingIngredients: {
      type: Array,
      default: () => []
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

    if (this.existingIngredients !== undefined) {
      this.existingIngredients.forEach(ingredient => {
        this.ingredientNumbers.push(counter++);
        if (typeof ingredient === Array) {
          this.amount.push(ingredient[0]);
          this.ingredients.push(ingredient[1]);
        } else {
          this.ingredients.push(ingredient);
        }
      });
    }
  }
};
</script>
