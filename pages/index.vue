<template>
  <div>
    <div v-if="user && !user.id">
      <cta-section />
    </div>

    <div class="desktop-width padding-h-lg margin-top-2xl margin-auto">
      <main-filter :recipes="publicRecipes" @filter="setVisibleRecipes" />
      <div class="flex-row flex-row--nowrap">
        <recipes-list
          v-if="loadedRecipes"
          :recipes="visibleRecipes"
          :isPublicList="true"
          addRecipeUrl="/account/my-cookbook/add-recipe"
        />
        <div v-else class="container">
          <span class="simple-loading-spinner margin-auto" />
        </div>
      </div>
    </div>
    <sign-up-section
      v-if="user && !user.id"
      id="signUp"
      class="container--full-height container--dark padding-top-3xl"
      :darkBg="true"
    />
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import user from "~/mixins/user.js";
import getPublicRecipes from "~/helpers/get-public-recipes.js";

import CtaSection from "~/components/CTASection/CTASection.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import RecipesList from "~/components/RecipePreview/RecipesList.vue";
import RecipeSearch from "~/components/Search/RecipeSearch.vue";
import MainFilter from "~/components/Filter/MainFilter";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    MainFilter,
    CtaSection,
    SignUpSection,
    RecipeSearch,
    RecipesList
  },
  head() {
    return {
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/"
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://kokebokami.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://firebasestorage.googleapis.com/v0/b/kokebokami-e788f.appspot.com/o/images%2Fglobals%2Fkokebokami-assets%2FlogoK-round.png?alt=media&token=a018646d-0837-44cc-9a2c-01c251f5ec84",
              "width": 500,
              "height": 500
            },
            "sameAs": ["https://www.facebook.com/kokebokami"]
          }
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://kokebokami.com"
          }
        }
      ]
    };
  },
  data() {
    return {
      initialFiltered: true,
      publicRecipes: [],
      filteredRecipes: [],
      filtered: false,
      searchOpen: false,
      errorMessage: "",
      loadedRecipes: false
    };
  },
  async asyncData({app}) {
    return await getPublicRecipes(app);
  },
  mixins: [user],
  computed: {
    initialRecipes() {
      let language = "English";
      if (this.$i18n.locale === "no") language = "Norwegian";

      return this.publicRecipes.filter(recipe => {
        return (
          recipe.language &&
          recipe.language.toLowerCase() === language.toLowerCase()
        );
      });
    },
    visibleRecipes() {
      if (this.initialFiltered && this.initialRecipes)
        return this.initialRecipes;
      if (!this.filtered && !this.initialFiltered) return this.publicRecipes;
      if (this.filtered) return this.filteredRecipes;
    }
  },
  methods: {
    closeSearch(event) {
      event && event.stopPropagation();
      this.searchOpen = false;
    },
    toggleSearch(event) {
      event && event.stopPropagation();
      this.searchOpen = !this.searchOpen;
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.initialFiltered = false;
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
