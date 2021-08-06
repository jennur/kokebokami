<template>
  <section class="main-filter">
    <radio-pills :pills="$t('recipes.allCategories.typeOfMeal')"
                 :values="$store.state.allCategories.typeOfMeal"
                 @selected="setTypeOfMeal"
    />
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
import RadioPills from "~/components/Input/RadioPills";
import LanguageInput from "~/components/Input/LanguageInput";

export default {
  name: "main-filter",
  components: {
    LanguageInput,
    RadioPills
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
      typeOfMeal: null
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
    filterRecipes(){
      let recipes = this.recipes;
      let typeOfMeal = this.typeOfMeal;
      let lang = this.language;

      if(!typeOfMeal && !lang) {
        this.$emit('filter', {recipes, filtered: true});
      } else {
        recipes = recipes.filter(recipe => {
          let isTypeOfMeal = true;
          let isInLanguage = true;

          if (typeOfMeal) isTypeOfMeal = recipe.typeOfMeal && recipe.typeOfMeal.indexOf(typeOfMeal) > -1;

          if(lang) isInLanguage = recipe.language && recipe.language === lang;

          return isTypeOfMeal && isInLanguage;
        })
        this.$emit('filter', {recipes, filtered: true});
      }
    }
  }

}
</script>
