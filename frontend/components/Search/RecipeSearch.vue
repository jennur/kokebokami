<template>
  <section class="search" :class="{ 'search--sticky': scrolled }">
    <form class="search__form" @submit.prevent>
      <fieldset>
        <label class="search-field">
          <search-icon class="search-icon" />
          <input
            type="text"
            :placeholder="$t('searchText')"
            v-model="searchTerm"
            @input="event => handleSearch(event.target)"
          />
        </label>
      </fieldset>
      <fieldset>
        <h5 class="categories__title">{{ $t("recipes.language") }}</h5>
        <select-component
          id="language"
          :options="languages"
          defaultValue="All languages"
          :preSelected="defaultLanguage"
          @select="language => handleSearch(language)"
        />
      </fieldset>
      <fieldset class="flex-column">
        <h5 class="margin-bottom--medium color--blue">
          {{ $t("recipes.typeOfMeal") }}
        </h5>
        <label
          class="flex-row flex-row--align-center margin-vertical--small"
          v-for="(typeOfMeal, index) in typesOfMeal"
          :key="typeOfMeal"
        >
          <input
            type="checkbox"
            :value="typeOfMeal"
            @change="event => handleSearch(event.target)"
          />
          {{ translatedCategories.typeOfMeal[index] }}
        </label>
      </fieldset>
      <fieldset class="flex-column">
        <h5 class="margin-bottom--medium color--blue">
          {{ $t("recipes.categories") }}
        </h5>
        <label
          class="flex-row flex-row--align-center margin-vertical--small"
          v-for="(category, index) in categories"
          :key="category"
        >
          <input
            type="checkbox"
            :value="category"
            @change="event => handleSearch(event.target)"
          />
          {{ translatedCategories.categories[index] }}
        </label>
      </fieldset>

      <fieldset class="flex-column">
        <h5 class="margin-bottom--medium color--blue">
          {{ $t("recipes.freeFrom") }}
        </h5>
        <label
          class="flex-row flex-row--align-center margin-vertical--small"
          v-for="(allergen, index) in allergens"
          :key="allergen"
        >
          <input
            type="checkbox"
            :value="allergen"
            @change="event => handleSearch(event.target)"
          />
          {{ translatedCategories.allergens[index] }}
        </label>
      </fieldset>
    </form>
  </section>
</template>

<script>
import SelectComponent from "~/components/Input/SelectComponent.vue";

export default {
  name: "recipe-search",
  components: {
    SelectComponent
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: "",
      checkedCategories: [],
      language: ""
    };
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
    translatedCategories() {
      return this.$t("recipes.allCategories");
    },
    allCategories() {
      return this.$store.state.allCategories;
    },
    languages() {
      return this.allCategories.languages;
    },
    typesOfMeal() {
      return this.allCategories.typeOfMeal;
    },
    categories() {
      return this.allCategories.categories;
    },
    allergens() {
      return this.allCategories.allergens;
    },
    scrolled() {
      //Check if scrolled
      return false;
    }
  },
  methods: {
    handleSearch(target) {
      let recipes = this.recipes;
      let language = this.language;
      let checkedCategories = [].concat(this.checkedCategories);
      let searchTerm = this.searchTerm;
      let filtered = false;

      if (target && target.type === "checkbox") {
        // Set categories
        let categoryIndex = checkedCategories.indexOf(target.value);
        if (target.checked) {
          checkedCategories.push(target.value);
        } else if (!target.checked && categoryIndex !== -1) {
          checkedCategories.splice(categoryIndex, 1);
        }
        this.checkedCategories = checkedCategories;
      } else if (typeof target === "string") {
        // Set language
        language = target;
        this.language = language;
      }

      //Filter on search term
      if (searchTerm !== "") {
        recipes = recipes.filter(recipe => {
          return (
            recipe[1].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe[1].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });
        filtered = true;
      }
      // Filter on language
      if (language !== "" && language !== "All languages") {
        recipes = recipes.filter(recipe => {
          if (recipe[1].language) {
            return recipe[1].language.toLowerCase() === language.toLowerCase();
          }
        });
        filtered = true;
      }
      // Filter on categories
      if (checkedCategories.length) {
        recipes = recipes.filter(recipe => {
          recipe = recipe[1];
          let categories = []
            .concat(recipe.categories)
            .concat(recipe.typeOfMeal)
            .concat(recipe.freeFrom)
            .filter(elem => elem);
          let inCategory = 1;
          checkedCategories.forEach(category => {
            if (categories) {
              inCategory *= categories.indexOf(category) > -1;
            }
          });
          return inCategory;
        });
        filtered = true;
      }

      let languageIsSet = language !== "" && language !== "All languages";

      if (!checkedCategories.length && !languageIsSet && searchTerm === "") {
        recipes = this.recipes;
        filtered = false;
      }
      this.$emit("search", { recipes, filtered });
    }
  }
};
</script>
