<template>
  <section  class="ingredients-section" 
            :class="{open}"
            @click="open = true"
            v-click-outside="event => closeSideBar(event)"
  
  >
    <button tabindex="0" 
            class="button button-sm ingredients-button" 
            :class="{open}"
            @click="open = !open"
            @keydown="event => event.keyCode === 13 && (open =!open)"
    >
      {{ $t("recipes.ingredients") }}
    </button>

      <div class="ingredients">
        <servings-display
          :servings="updatedServings.toString()"
          :defaultServings="servings"
          @update-servings="setServings"
          :isRecipeOwner="isRecipeOwner"
          :recipeKey="recipeKey"
          @update="payload => $emit('update', payload)"
          :key="updated"
        />
        <div>
          <div class="flex-row flex-row--align-center flex-row--nowrap">
            <h3 class="margin-v-md">{{ $t("recipes.ingredients") }}</h3>
            <edit-icon
              tabindex="0"
              v-if="isRecipeOwner && !editMode"
              @click="event => toggleEditMode(event)"
              class="icon margin-md"
            />
          </div>
          <ul v-if="!editMode && !loading" class="recipe_ingredients">
            <li
              v-for="(ingredient, index) in calculatedIngredients"
              :key="`ingredient-${index}`"
              @click="handleCheck(index)"
            >
              <span class="check-circle" 
                    :class="checkedIngredients.indexOf(index) > -1 && 'check-circle--checked'"
              ></span>
              <div class="ingredient">
                <span class="amount">
                  {{ ingredient.amount }}
                </span>
                {{ ingredient.item }}
              </div>
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
          v-if="!editMode && ingredients.length"
          class="margin-bottom-2xl"
          :recipeTitle="recipeTitle"
          :ingredients="calculatedIngredients"
        />
      </div>
  </section>
</template>

<script>
import user from "~/mixins/user.js";
import ServingsDisplay from "./ServingsDisplay.vue";
import IngredientsEdit from "./Editing/IngredientsEdit.vue";
import AddToShoppingList from "../Interaction/AddToShoppingList.vue";
import ClickOutside from "vue-click-outside";

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
      loading: false,
      updated: 0,
      checkedIngredients: [],
      open: false
    };
  },
  watch: {
    servings(value) {
      this.updatedServings = value;
    }
  },
  computed: {
    convertedIngredients() {
      return this.convertIngredients(this.ingredients);
    },
    calculatedIngredients() {
      let ingredients = JSON.parse(JSON.stringify(this.convertedIngredients));
      let updatedServings = this.updatedServings;
      let servings = this.servings;

      ingredients = ingredients.map(ingredient => {
        let amount = ingredient.amount;
        if (amount && servings && updatedServings !== servings) {
          let oneServing = amount / servings;
          ingredient.amount =
            Math.round(oneServing * updatedServings * 100) / 100;
        }
        return ingredient;
      });
      this.$emit("calculated-ingredients", {
        ingredients,
        servings: updatedServings
      });
      return ingredients;
    }
  },
  methods: {
    closeSideBar(event) {
      event && event.stopPropagation();
      this.open = false;
    },
    handleCheck(ingredientIndex) {
      let indexInArray = this.checkedIngredients.indexOf(ingredientIndex);
      if(indexInArray > -1) {
        this.checkedIngredients.splice(indexInArray,1);
      }
      else {
        this.checkedIngredients.push(ingredientIndex);
      }
    },
    setServings(number) {
      this.updatedServings = number;
    },
    toggleEditMode(event) {
      event && event.stopPropagation();
      this.editMode = !this.editMode;
    },
    saveIngredients(ingredients) {
      this.editMode = false;
      let recipeKey = this.recipeKey;
      ingredients = ingredients.map(ingredient => {
        return `${ingredient.amount} ${ingredient.item}`;
      });

      if (recipeKey) {
        this.loading = true;
        let ingredientsRef = this.$fire.database.ref(
          `recipes/${recipeKey}/ingredients`
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
      } else {
        this.$emit("update", { ingredients });
      }
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
  },
  directives: {
    ClickOutside
  }
};
</script>
