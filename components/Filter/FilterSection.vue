<template>
  <section class="filter-section">
    <div class="flex flex-align--center">
      <span
        tabindex="0"
        role="button"  
        :title="$t('openFilter')"
        @click="open = !open"
        @keydown="event => event.keyCode === 13 && (open = !open)"
      >
        <fa :icon="['fas', 'sliders-h']" style="font-size:25px;cursor:pointer;"/>
      </span>
      
      <Search class="search-field margin-left-md" 
              @filterOnSearchTerm="searchTerm => setSearchTerm(searchTerm)"
      />
    </div>
    <Expand :show="open">
      <div class="filter">
        <div>
          <h2 class="heading--lg">{{ $t("recipes.typeOfMeal") }}</h2>

          <RadioPills  pillsTranslationCode="recipes.allCategories.typeOfMeal"
                        :values="recipeStore.allCategories.typeOfMeal"
                        @selected="setTypeOfMeal"
          />
        </div>

        <div>
          <h2 class="heading--lg">{{ $t("recipes.freeFrom") }}</h2>
          <RadioPills  pillsTranslationCode="recipes.allCategories.allergens"
                        :values="recipeStore.allCategories.allergens"
                        @selected="setAllergen"
          />
        </div>

        <div>
          <h2 class="heading--lg">{{ $t("recipes.category") }}</h2>
          <RadioPills  pillsTranslationCode="recipes.allCategories.categories"
                        :values="recipeStore.allCategories.categories"
                        @selected="setCategory"
          />
        </div>
      </div>

      
    </expand>
    <div class="recipe-lang-select-wrap margin-top-xl">
      <span class="label">{{ $t("recipeLanguage") }}:</span>
      <LanguageInput :existing-language="defaultLanguage"
                      :naked="true"
                      @selected="setLanguage"
      />
    </div>

  </section>
</template>

<script setup>
import RadioPills from "./RadioPills";
import LanguageInput from "~/components/Input/LanguageInput";
import Search from "./Search.vue";
import Expand from '../Transitions/Expand.vue';
import { useRecipeStore } from "~/store";

const recipeStore = useRecipeStore();
const { locale } = useI18n();

const emit = defineEmits(["filter"]);

const props = defineProps({
  recipes: {
    type: Array,
    default: () => []
  },
  initialRecipes: {
    type: Array,
    default: () => []
  }
});

const open = ref(false);
const language = ref(null);
const typeOfMeal = ref(null);
const category = ref(null);
const allergen = ref(null);
const searchTerm = ref(null);

const defaultLanguage = computed(() => {
  if (locale === "no") {
    language.value = "Norwegian";
    return "Norwegian";
  }
  language.value = "English";
  return "English";
});

function setTypeOfMeal(type) {
  typeOfMeal.value = type;
  filterRecipes();
}

function setCategory(type) {
  category.value = type;
  filterRecipes();
}

function setAllergen(type) {
  allergen.value = type;
  filterRecipes();
}

function setLanguage(lang) {
  if(lang === "All languages") language.value = null;
  else language.value = lang;
  filterRecipes();
}

function setSearchTerm(value) {
  searchTerm.value = value;
  filterRecipes();
}

function filterRecipes() {
  const search = searchTerm.value?.toLowerCase();

  if(!typeOfMeal.value && !category.value && !allergen.value && !language.value && !search) {
    emit('filter', {
      recipes: props.recipes, 
      filtered: true
    });
  } else {
    const filteredRecipes = props.recipes.filter(recipe => {
      let isTypeOfMeal = true;
      let isInCategory = true;
      let isFreeFrom = true;
      let isInLanguage = true;
      let hasSearchTerm = true;

      if(typeOfMeal.value) isTypeOfMeal = recipe.typeOfMeal?.indexOf(typeOfMeal.value) > -1;
      if(category.value) isInCategory = recipe.categories?.indexOf(category.value) > -1;
      if(allergen.value) isFreeFrom = recipe.freeFrom?.indexOf(allergen.value) > -1;
      if(language.value) isInLanguage = recipe.language === language.value;
      if(search) hasSearchTerm = recipe.title?.toLowerCase().indexOf(search) > -1 || recipe.description.toLowerCase().indexOf(searchTerm) > -1;

      return isTypeOfMeal && isInCategory && isFreeFrom && isInLanguage && hasSearchTerm;
    })

    emit('filter', {
      recipes: filteredRecipes,
      filtered: true
    });
  }
}
</script>
