<template>
  <div v-if="!user">
    <section class="tablet-width margin-top--xxlarge margin--auto">
      <div
        class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
      >
        <h1
          class="heading--display-font padding-horizontal--large"
        >It's time to digitalize your cook book!</h1>
        <p
          class="padding-horizontal--large color--blue font-size--medium text-align--center"
        >Start storing your personal recipes online to make sure they never get lost. Keep them private, share them with the public or your friends only.</p>
        <nuxt-link
          to="/sign-up"
          class="button button--large padding-horizontal--xlarge margin-top--large"
          v-if="!user"
        >Get started ➔</nuxt-link>
      </div>
      <div class="flex-center-container">
        <kokeboka class="graphic graphic--kokeboka" />
      </div>
    </section>

    <sign-up-section
      class="container--blue"
      :darkBg="true"
      headline="Sign up to start building your own cook book."
    />
  </div>

  <div class="tablet-width padding-horizontal--large margin-top--xxlarge margin--auto" v-else>
    <div class="flex-row flex-row--justify-center margin-bottom--xlarge margin--auto">
      <nuxt-link to="/cooks" class="button button--large">Discover cooks on Kokebokami</nuxt-link>
    </div>
    <search-form
      class="margin-bottom--xlarge margin--auto"
      @filterBySearchTerm="setSearchTerm"
      @filterByCategory="setCategory"
    />
    <recipes-list :recipes="visibleRecipes" :publicRecipe="true" />
  </div>
</template>

<script>
import { GoogleProvider, auth } from "~/plugins/firebase.js";
import googleLogo from "~/static/btn_google_light_normal_ios.svg";
import { user } from "~/mixins/getCurrentUser.js";
import kokeboka from "~/assets/graphics/veggies.svg";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";

import SearchForm from "~/components/Search/SearchForm.vue";
import RecipesList from "~/components/RecipesList.vue";

export default {
  name: "Home",
  components: {
    kokeboka,
    SignUpSection,
    SearchForm,
    RecipesList
  },
  data() {
    return {
      categories: [],
      searchTerm: "",
      filteredRecipes: []
    };
  },
  mixins: [user],
  computed: {
    visibleRecipes() {
      let publicRecipes = this.$store.getters.publicRecipes;
      let categories = this.categories;
      let searchTerm = this.searchTerm;
      let filteredRecipes = [];
      let recipesToBeFiltered = publicRecipes;

      if (categories.length) {
        categories.forEach(category => {
          let oneOrMoreRecipesOfCategory = -1;
          recipesToBeFiltered.forEach(recipe => {
            if (recipe[1].categories.indexOf(category) !== -1) {
              oneOrMoreRecipesOfCategory *= 0;
              if (filteredRecipes.indexOf(recipe) === -1)
                filteredRecipes.push(recipe);
            }
          });
        });
        recipesToBeFiltered = filteredRecipes;
      }

      if (searchTerm !== "") {
        recipesToBeFiltered = recipesToBeFiltered.filter(recipe => {
          return (
            recipe[1].title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe[1].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });
      }

      return recipesToBeFiltered;
    }
  },
  methods: {
    setCategory(category) {
      let categoryIndex = this.categories.indexOf(category.value);

      if (category.checked) {
        this.categories.push(category.value);
      } else if (!category.checked && categoryIndex !== -1) {
        this.categories.splice(categoryIndex, 1);
      }
    },
    setSearchTerm(value) {
      this.searchTerm = value;
    }
  }
};
</script>
