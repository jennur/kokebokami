<template>
  <section>
    <div
      class="recipe__servings-wrap flex-row flex-row--align-center margin-vertical--xxlarge"
    >
      <span v-if="!servings" class="recipe__servings-disabled-dash">-</span>
      <input
        class="recipe__servings margin-right--medium"
        type="Number"
        min="0"
        step="1"
        v-model="updatedServings"
        :disabled="!servings"
      />

      <h4
        class="margin--none margin-bottom--small"
        :class="{ disabled: !servings }"
      >
        Servings {{ !servings ? "🤷" : "" }}
      </h4>
    </div>
    <div>
      <h4>Ingredients</h4>
      <ul class="recipe__ingredients">
        <li
          v-for="(ingredient, index) in ingredientArray[1]"
          :key="`ingredient-${index}`"
        >
          <span class="recipe__ingredients-amount">{{
            ingredientArray[0][index]
          }}</span>
          {{ ingredient }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "ingredients-display",
  props: {
    servings: {
      type: String,
      default: ""
    },
    ingredients: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      updatedServings: this.servings,
      amounts: [],
      ingredientItems: []
    };
  },
  computed: {
    ingredientArray() {
      let ingredients = this.ingredients;
      let amounts = [];
      let ingredientItems = [];
      let updatedServings = this.updatedServings;
      let servings = this.servings;

      ingredients.forEach(ingredient => {
        let numberRegex = /[\d.,\/\s]+/;
        let fractionRegex = /^\s*\d+\s*\/\s*\d+\s*$/;
        let wholeFractionRegex = /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/;
        let amount = ingredient.match(numberRegex);
        if (amount && amount.length) {
          amount = amount[0];

          let ingredientItem = ingredient.replace(amount, " ");

          if (fractionRegex.test(amount)) {
            amount = amount.split(" ").join("");
            amount = this.fractionToDecimal(amount);
          } else if (wholeFractionRegex.test(amount)) {
            amount = amount.split(" ");
            let fraction = amount.filter(elem => {
              return fractionRegex.test(elem);
            });
            let decimal = this.fractionToDecimal(fraction[0]);
            amount = parseInt(amount[0]) + decimal;
          }
          if (servings && updatedServings !== servings) {
            let oneServing = amount / servings;
            amount = Math.round(oneServing * updatedServings * 100) / 100;
          }
          amounts.push(amount);
          ingredientItems.push(ingredientItem);
        } else {
          amounts.push("");
          ingredientItems.push(ingredient);
        }
      });
      return [amounts, ingredientItems];
    }
  },
  methods: {
    fractionToDecimal(number) {
      let fraction = number.split("/");
      let dividend = parseInt(fraction[0]);
      let divisor = parseInt(fraction[1]);
      return Math.round((dividend / divisor) * 100) / 100;
    }
  }
};
</script>
