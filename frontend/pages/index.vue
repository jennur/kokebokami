<template>
  <div v-if="!user">
    <section
      class="tablet-width margin--auto padding-horizontal--large margin-top--xxlarge"
    >
      <div
        class="flex-center-container flex-center-container--column mobile-width padding--none margin--auto"
      >
        <h1 class="heading--display-font padding-horizontal--large">
          It's time to digitalize your cook book!
        </h1>
        <p
          class="padding-horizontal--large color--blue font-size--medium text-align--center"
        >
          Start storing your personal recipes online to make sure they never get
          lost. Keep them private, share them with the public or your friends
          only.
        </p>
        <nuxt-link
          to="/sign-up"
          class="button button--large padding-horizontal--xlarge margin-top--large"
          v-if="!user"
          >Get started ➔</nuxt-link
        >
      </div>
      <div class="flex-center-container">
        <kokeboka class="illustration illustration--kokeboka" />
      </div>
    </section>

    <sign-up-section
      class="container--blue"
      :darkBg="true"
      headline="Sign up to start building your own cook book."
    />
  </div>

  <div
    class="tablet-width padding-horizontal--large margin-top--xxlarge margin--auto"
    v-else
  >
    <recipes-filter
      class="margin-bottom--xlarge margin--auto"
      :recipes="recipes"
      @filter="setVisibleRecipes"
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

import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    kokeboka,
    SignUpSection,
    RecipesFilter,
    RecipesList
  },
  data() {
    return {
      filteredRecipes: [],
      filtered: false
    };
  },
  computed: {
    recipes() {
      return this.$store.getters.publicRecipes;
    },
    visibleRecipes() {
      if (!this.filtered) return this.recipes;
      if (this.filtered) return this.filteredRecipes;
    }
  },
  mixins: [user],
  methods: {
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  }
};
</script>
