<template>
  <section>
    <div
      id="servings"
      class="recipe__servings-wrap flex-row flex-row--align-center margin-vertical--xxlarge"
    >
      <span v-if="!servings" class="recipe__servings-disabled-dash">-</span>
      <input
        class="recipe__servings margin-right--medium"
        type="Number"
        min="1"
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
      <edit-icon
        v-if="isRecipeOwner"
        @click="event => toggleEditMode(event.target)"
        class="icon margin-left--medium"
      />
    </div>
    <div>
      <div
        id="ingredients"
        class="flex-row flex-row--align-center flex-row--nowrap"
      >
        <h4 class="margin-vertical--medium">Ingredients</h4>
        <edit-icon
          v-if="isRecipeOwner && !editIngredients"
          @click="event => toggleEditMode(event.target)"
          class="icon margin--medium"
        />
      </div>
      <ul v-if="!editIngredients && !loading" class="recipe__ingredients">
        <li
          v-for="(ingredient, index) in calculatedIngredients"
          :key="`ingredient-${index}`"
        >
          <span class="recipe__ingredients-amount">
            {{ ingredient.amount }}
          </span>
          {{ ingredient.item }}
        </li>
      </ul>
      <span v-if="loading" class="simple-loading-spinner"></span>
      <ingredients-edit
        v-if="editIngredients"
        :ingredients="convertedIngredients"
        @save="saveIngredients"
      />
    </div>

    <add-to-shopping-list
      v-if="!editIngredients"
      class="margin-bottom--xxlarge"
      :recipeTitle="recipeTitle"
      :ingredients="calculatedIngredients"
    />
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import IngredientsEdit from "./Editing/IngredientsEdit.vue";
import AddToShoppingList from "../Interaction/AddToShoppingList.vue";

export default {
  name: "ingredients-display",
  components: {
    AddToShoppingList,
    IngredientsEdit
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
    },
    recipeKey: {
      type: String,
      default: ""
    },
    isRecipeOwner: {
      type: Boolean,
      default: false
    }
  },
  mixins: [user],

  data() {
    return {
      updatedServings: this.servings,
      amounts: [],
      editServings: false,
      editIngredients: false,
      loading: false
    };
  },
  computed: {
    convertedIngredients() {
      return this.convertIngredients(this.ingredients);
    },
    calculatedIngredients() {
      let ingredients = JSON.parse(JSON.stringify(this.convertedIngredients));
      let updatedServings = this.updatedServings;
      let servings = this.servings;

      return ingredients.map(ingredient => {
        let amount = ingredient.amount;
        if (amount && servings && updatedServings !== servings) {
          let oneServing = amount / servings;
          ingredient.amount =
            Math.round(oneServing * updatedServings * 100) / 100;
        }
        return ingredient;
      });
    }
  },
  methods: {
    toggleEditMode(target) {
      let id = target.parentElement.id;
      if (id === "ingredients") {
        this.editIngredients = !this.editIngredients;
      }
      if (id === "servings") {
        this.editServings = !this.editServings;
      }
    },
    saveIngredients(ingredients) {
      this.editIngredients = false;
      this.loading = true;
      ingredients = ingredients.map(ingredient => {
        return `${ingredient.amount} ${ingredient.item}`;
      });
      let ingredientsRef = this.$fireDb.ref(
        `recipes/${this.recipeKey}/ingredients`
      );
      ingredientsRef
        .set(ingredients)
        .then(() => {
          console.log("Successfully updated ingredients");
          this.$emit("update");
        })
        .then(() => {
          this.loading = false;
        })
        .catch(error =>
          console.log("Error setting ingredients:", error.message)
        );
    },
    convertIngredients(ingredients) {
      let numberRegex = /[\d.,\/\s]+/;
      let fractionRegex = /^\s*\d+\s*\/\s*\d+\s*$/;
      let wholeFractionRegex = /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/;

      return ingredients.map((ingredient, index) => {
        let amount = ingredient.match(numberRegex);
        amount = amount && amount[amount.index];
        let item = ingredient.replace(amount, "");
        amount && amount.split(" ").join("");

        if (fractionRegex.test(amount)) {
          amount = this.fractionToDecimal(amount);
        } else if (wholeFractionRegex.test(amount)) {
          amount = amount.split(" ");
          let fraction = amount.filter(elem => {
            return fractionRegex.test(elem);
          });
          let decimal = this.fractionToDecimal(fraction[0]);
          amount = parseInt(amount[0]) + decimal;
        } else amount = parseInt(amount);
        return {
          amount,
          item,
          id: index
        };
      });
    },
    fractionToDecimal(number) {
      let fraction = number.split("/");
      let dividend = parseInt(fraction[0]);
      let divisor = parseInt(fraction[1]);
      return Math.round((dividend / divisor) * 100) / 100;
    }
  }
};
</script>
