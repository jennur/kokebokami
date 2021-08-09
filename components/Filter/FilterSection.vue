<template>
  <section class="filter-section">
    <div class="filter">
      <radio-pills  class="filter-pills"
                    :pills="$t('recipes.allCategories.typeOfMeal')"
                    :values="$store.state.allCategories.typeOfMeal"
                    @selected="setTypeOfMeal"
      />
      <search class="search-field" @filterOnSearchTerm="searchTerm => setSearchTerm(searchTerm)"/>
    </div>

    <div class="recipe-lang-select-wrap margin-top-xl">
      <span class="label">Recipe language:</span>
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

export default {
  name: "filter-section",
  components: {
    LanguageInput,
    RadioPills,
    Search
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
      language: null,
      typeOfMeal: null,
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
      let lang = this.language;
      let searchTerm = this.searchTerm && this.searchTerm.toLowerCase();

      if(!typeOfMeal && !lang && !searchTerm) {
        this.$emit('filter', {recipes, filtered: true});
      } else {
        recipes = recipes.filter(recipe => {
          let isTypeOfMeal = true;
          let isInLanguage = true;
          let hasSearchTerm = true;
          
          if(typeOfMeal) isTypeOfMeal = recipe.typeOfMeal && recipe.typeOfMeal.indexOf(typeOfMeal) > -1;
          if(lang) isInLanguage = recipe.language && recipe.language === lang;
          if(searchTerm) hasSearchTerm = recipe.title.toLowerCase().indexOf(searchTerm) > -1 || recipe.description.toLowerCase().indexOf(searchTerm) > -1;

          return isTypeOfMeal && isInLanguage && hasSearchTerm;
        })
        this.$emit('filter', {recipes, filtered: true});
      }
    }
  }

}
</script>
