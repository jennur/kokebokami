<template>
  <section>
    <servings-display
      :servings="updatedServings"
      :defaultServings="servings"
      @updateServings="setServings"
      :isRecipeOwner="isRecipeOwner"
      :recipeKey="recipeKey"
      @update="$emit('update')"
    />
    <div>
      <div class="flex-row flex-row--align-center flex-row--nowrap">
        <h4 class="margin-vertical--medium">Ingredients</h4>
        <edit-icon
          v-if="isRecipeOwner && !editMode"
          @click="toggleEditMode"
          class="icon margin--medium"
        />
      </div>
      <ul v-if="!editMode && !loading" class="recipe__ingredients">
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
        v-if="editMode"
        :ingredients="convertedIngredients"
        @save="saveIngredients"
      />
    </div>

    <add-to-shopping-list
      v-if="!editMode"
      class="margin-bottom--xxlarge"
      :recipeTitle="recipeTitle"
      :ingredients="calculatedIngredients"
    />
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import ServingsDisplay from "./ServingsDisplay.vue";
import IngredientsEdit from "./Editing/IngredientsEdit.vue";
import AddToShoppingList from "../Interaction/AddToShoppingList.vue";

export default {
  name: "ingredients-display",
  components: {
    ServingsDisplay,
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
      editMode: false,
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
    setServings(number) {
      this.updatedServings = number;
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveIngredients(ingredients) {
      this.editMode = false;
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
        } else amount = parseFloat(amount);
        return {
          amount,
          item: item && item.replace("NaN", ""),
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
