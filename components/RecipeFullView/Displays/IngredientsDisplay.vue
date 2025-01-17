<template>
  <section
    class="ingredients-section"
    :class="{ open }"
    @click="open = true"
    v-click-outside="(event) => closeSideBar(event)"
  >
    <button
      tabindex="0"
      class="button button-sm ingredients-button"
      :class="{ open }"
      @click="open = !open"
      @keydown="(event) => event.keyCode === 13 && (open = !open)"
    >
      {{ $t("recipes.ingredients") }}
    </button>

    <div class="ingredients">
      <ServingsDisplay
        :servings="updatedServings.toString()"
        :defaultServings="servings"
        @update-servings="setServings"
        :isRecipeOwner="isRecipeOwner"
        :recipeKey="recipeKey"
        @update="(payload) => $emit('update', payload)"
        :key="updated"
      />
      <div>
        <div class="flex-row flex-row--align-center flex-row--nowrap">
          <h3 class="margin-v-md">{{ $t("recipes.ingredients") }}</h3>
          <EditIcon
            tabindex="0"
            v-if="isRecipeOwner && !editMode"
            @click="(event) => toggleEditMode(event)"
            class="icon margin-md"
          />
        </div>
        <ul v-if="!editMode && !loading" class="recipe_ingredients">
          <li
            v-for="(ingredient, index) in calculatedIngredients"
            :key="`ingredient-${index}`"
            @click="handleCheck(index)"
          >
            <span
              class="check-circle"
              :class="
                checkedIngredients.indexOf(index) > -1 &&
                'check-circle--checked'
              "
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

        <IngredientsEdit
          v-if="editMode"
          :ingredients="convertedIngredients"
          @save="saveIngredients"
        />
      </div>

      <AddToShoppingList
        v-if="!editMode && ingredients.length"
        class="margin-bottom-2xl"
        :recipeTitle="recipeTitle"
        :ingredients="calculatedIngredients"
      />
    </div>
  </section>
</template>

<script setup>
import { getDatabase, ref, set } from "firebase/database";
import ServingsDisplay from "./ServingsDisplay.vue";
import IngredientsEdit from "./Editing/IngredientsEdit.vue";
import AddToShoppingList from "../Interaction/AddToShoppingList.vue";

const emit = defineEmits(["calculated-ingredients", "update"]);

const props = defineProps({
  servings: {
    type: String,
    default: "",
  },
  ingredients: {
    type: Array,
    default: () => [],
  },
  recipeTitle: {
    type: String,
    default: "",
  },
  recipeKey: {
    type: String,
    default: "",
  },
  isRecipeOwner: {
    type: Boolean,
    default: false,
  },
});

const { servings } = toRefs(props);
const updatedServings = ref(props.servings);
const editMode = ref(false);
const loading = ref(false);
const updated = ref(0);
const checkedIngredients = ref([]);
const open = ref(false);

watch(servings, () => {
  updatedServings.value = props.servings;
});

const convertedIngredients = computed(() => {
  return convertIngredients(props.ingredients);
});

const calculatedIngredients = computed(() => {
  const ingredients = JSON.parse(JSON.stringify(convertedIngredients.value));
  const updatedServings = updatedServings.value;
  const servings = props.servings;

  ingredients = ingredients.map((ingredient) => {
    const amount = ingredient.amount;
    if (amount && servings && updatedServings !== servings) {
      const oneServing = amount / servings;
      ingredient.amount = Math.round(oneServing * updatedServings * 100) / 100;
    }
    return ingredient;
  });

  emit("calculated-ingredients", {
    ingredients,
    servings: updatedServings,
  });

  return ingredients;
});

function closeSideBar(event) {
  event && event.stopPropagation();
  open.value = false;
}

function handleCheck(ingredientIndex) {
  const index = checkedIngredients.value.indexOf(ingredientIndex);
  if (index > -1) {
    checkedIngredients.value.splice(index, 1);
  } else {
    checkedIngredients.value.push(ingredientIndex);
  }
}

function setServings(number) {
  updatedServings.value = number;
}

function toggleEditMode(event) {
  event && event.stopPropagation();
  editMode.value = !editMode.value;
}

function saveIngredients(ingredients) {
  editMode.value = false;
  const recipeKey = props.recipeKey;
  ingredients = ingredients.map((ingredient) => {
    return `${ingredient.amount} ${ingredient.item}`;
  });

  if (recipeKey) {
    loading.value = true;
    const db = getDatabase();
    set(ref(db, `recipes/${recipeKey}/ingredients`), ingredients)
      .then(() => {
        console.info("[saveIngredients] Successfully updated ingredients");
        emit("update");
      })
      .then(() => {
        loading.value = false;
      })
      .catch((error) =>
        console.error("[saveIngredients]", error.message)
      );
  } else {
    emit("update", { ingredients });
  }
}

function convertIngredients(ingredients) {
  const numberRegex = /[\d.,\/\s]+/;
  const fractionRegex = /^\s*\d+\s*\/\s*\d+\s*$/;
  const wholeFractionRegex = /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/;

  return ingredients.map((ingredient, index) => {
    let amount = ingredient.match(numberRegex);
    amount = amount && amount[amount.index];
    let item = ingredient.replace(amount, "");
    amount && amount.split(" ").join("");

    if (fractionRegex.test(amount)) {
      amount = fractionToDecimal(amount);
    } else if (wholeFractionRegex.test(amount)) {
      amount = amount.split(" ");
      let fraction = amount.filter((elem) => {
        return fractionRegex.test(elem);
      });
      let decimal = fractionToDecimal(fraction[0]);
      amount = parseInt(amount[0]) + decimal;
    } else amount = parseFloat(amount);
    return {
      amount,
      item: item && item.replace("NaN", ""),
      id: index,
    };
  });
}

function fractionToDecimal(number) {
  const fraction = number.split("/");
  const dividend = parseInt(fraction[0]);
  const divisor = parseInt(fraction[1]);
  return Math.round((dividend / divisor) * 100) / 100;
}
</script>
