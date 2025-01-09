<template>
  <section class="filter-section">
    <div class="flex flex-align--center">
        <fa tabindex="0"
            :icon="['fas', 'sliders-h']"
            style="font-size:25px;cursor:pointer;"
            @click="open = !open"
            @keydown="event => event.keyCode === 13 && (open = !open)"
            :title="$t('openFilter')"
        />
      <search class="search-field margin-left-md" 
              @filterOnSearchTerm="searchTerm => setSearchTerm(searchTerm)"
      />
    </div>
    <expand :show="open">
      <div class="filter">
        <div>
          <h2 class="heading--lg">{{ $t("recipes.typeOfMeal") }}</h2>
          <radio-pills  :pills="$t('recipes.allCategories.typeOfMeal')"
                        :values="$store.state.allCategories.typeOfMeal"
                        @selected="setTypeOfMeal"
          />
        </div>

        <div>
          <h2 class="heading--lg">{{ $t("recipes.freeFrom") }}</h2>
          <radio-pills  :pills="$t('recipes.allCategories.allergens')"
                        :values="$store.state.allCategories.allergens"
                        @selected="setAllergen"
          />
        </div>

        <div>
          <h2 class="heading--lg">{{ $t("recipes.category") }}</h2>
          <radio-pills  :pills="$t('recipes.allCategories.categories')"
                        :values="$store.state.allCategories.categories"
                        @selected="setCategory"
          />
        </div>
      </div>

      
    </expand>
    <div class="recipe-lang-select-wrap margin-top-xl">
      <span class="label">{{ $t("recipeLanguage") }}:</span>
      <language-input :existing-language="defaultLanguage"
                      :naked="true"
                      @selected="setLanguage"
      />
    </div>

  </section>
</template>

<script>
import RadioPills from "./RadioPills";
import LanguageInput from "~/components/Input/LanguageInput";
import Search from "./Search.vue";
import Expand from '../Transitions/Expand.vue';

export default {
  name: "filter-section",
  components: {
    LanguageInput,
    RadioPills,
    Search,
    Expand
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    },
    initialRecipes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      open: false,
      language: null,
      typeOfMeal: null,
      category: null,
      allergen: null,
      searchTerm: null
    }
  },
  computed: {
    defaultLanguage() {
      if (this.$i18n.locale === "no") {
        this.language = "Norwegian";
        return "Norwegian";
      }
      this.language = "English";
      return "English";
    },
  },
  methods: {
    setTypeOfMeal(type){
      this.typeOfMeal = type;
      this.filterRecipes();
    },
    setCategory(type){
      this.category = type;
      this.filterRecipes();
    },
    setAllergen(type){
      this.allergen = type;
      this.filterRecipes();
    },
    setLanguage(lang){
      if(lang === "All languages") this.language = null;
      else this.language = lang;
      this.filterRecipes();
    },
    setSearchTerm(value) {
      this.searchTerm = value;
      this.filterRecipes();
    },
    filterRecipes(){
      let recipes = this.recipes;
      let typeOfMeal = this.typeOfMeal;
      let category = this.category;
      let allergen = this.allergen;
      let lang = this.language;
      let searchTerm = this.searchTerm && this.searchTerm.toLowerCase();

      if(!typeOfMeal && !category && !allergen && !lang && !searchTerm) {
        this.$emit('filter', {recipes, filtered: true});
      } else {
        recipes = recipes.filter(recipe => {
          let isTypeOfMeal = true;
          let isInCategory = true;
          let isFreeFrom = true;
          let isInLanguage = true;
          let hasSearchTerm = true;

          if(typeOfMeal) isTypeOfMeal = recipe.typeOfMeal && recipe.typeOfMeal.indexOf(typeOfMeal) > -1;
          if(category) isInCategory = recipe.categories && recipe.categories.indexOf(category) > -1;
          if(allergen) isFreeFrom = recipe.freeFrom && recipe.freeFrom.indexOf(allergen) > -1;
          if(lang) isInLanguage = recipe.language && recipe.language === lang;
          if(searchTerm) hasSearchTerm = recipe.title.toLowerCase().indexOf(searchTerm) > -1 || recipe.description.toLowerCase().indexOf(searchTerm) > -1;

          return isTypeOfMeal && isInCategory && isFreeFrom && isInLanguage && hasSearchTerm;
        })
        this.$emit('filter', {recipes, filtered: true});
      }
    }
  }

}
</script>
