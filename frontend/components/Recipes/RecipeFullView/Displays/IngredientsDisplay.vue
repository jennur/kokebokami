<template>
  <section>
    <div class="recipe__servings-wrap flex-row flex-row--align-center margin-vertical--xxlarge">
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
      >Servings {{ !servings ? "🤷" : "" }}</h4>
    </div>
    <div>
      <h4>Ingredients</h4>
      <ul class="recipe__ingredients">
        <li v-for="(ingredient, index) in ingredientArray" :key="`ingredient-${index}`">
          <span class="recipe__ingredients-amount">
            {{
            ingredientArray[index][0]
            }}
          </span>
          {{ ingredientArray[index][1] }}
        </li>
      </ul>
    </div>
    <add-to-shopping-list
      class="margin-bottom--xxlarge"
      :recipeTitle="recipeTitle"
      :ingredients="ingredientArray"
    />
  </section>
</template>

<script>
import user from "~/mixins/user.js";

import AddToShoppingList from "../Interaction/AddToShoppingList.vue";

export default {
  name: "ingredients-display",
  components: {
    AddToShoppingList
  },
  props: {
    servings: {
      type: String,
      default: ""
    },
    ingredients: {
      type: Array,
      default: () => []
    },
    recipeTitle: {
      type: String,
      default: ""
    }
  },
  mixins: [user],

  data() {
    return {
      updatedServings: this.servings,
      amounts: []
    };
  },
  computed: {
    ingredientArray() {
      let ingredients = this.ingredients;
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
          ingredientItems.push([amount, ingredientItem]);
        } else {
          ingredientItems.push(["", ingredient]);
        }
      });
      return ingredientItems;
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
