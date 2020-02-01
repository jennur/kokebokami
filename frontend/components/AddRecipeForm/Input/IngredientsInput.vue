<template>
  <fieldset id="ingredientList" class="add-recipe-form__ingredients flex-column">
    <h4>Ingredients</h4>
    <span
      class="flex-row flex-row--align-center margin-bottom--small"
      v-for="number in ingredientNumbers"
      :key="number"
    >
      <label>
        <input
          class="add-recipe-form__ingredient"
          type="text"
          placeholder="Amount of something"
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
    >Add ingredient</increment-button>
  </fieldset>
</template>

<script>
import IncrementButton from "../Actions/IncrementButton.vue";
import DecrementButton from "../Actions/DecrementButton.vue";

export default {
  name: "ingredients-input",
  components: {
    IncrementButton,
    DecrementButton
  },
  data() {
    return { ingredients: [] };
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
  created() {
    let counter = 0;

    if (this.existingIngredients !== undefined) {
      this.existingIngredients.forEach(ingredient => {
        this.ingredientNumbers.push(counter++);
        this.ingredients.push(ingredient);
      });
    }
  }
};
</script>
