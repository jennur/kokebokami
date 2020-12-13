<template>
  <div>
    <div v-if="user && !user.id">
      <initial-info-section />
    </div>

    <div
      class="desktop-width padding-horizontal--large margin-top--xxlarge margin--auto"
    >
      <button
        class="search__button button button--small button--green-border margin--medium"
        @click="event => toggleSearch(event)"
      >
        {{ $t("searchText") }}
      </button>
      <div class="flex-row flex-row--nowrap">
        <recipe-search
          :class="{ 'search--open': searchOpen }"
          :recipes="publicRecipes"
          :initialRecipes="initialRecipes"
          @search="setVisibleRecipes"
          v-click-outside="event => closeSearch(event)"
        />
        <recipes-list
          v-if="loaded"
          :recipes="visibleRecipes"
          :isPublicList="true"
          addRecipeUrl="/account/my-cookbook/add-recipe"
        />
        <div v-else class="container">
          <span class="simple-loading-spinner margin--auto" />
        </div>
      </div>
    </div>
    <sign-up-section
      v-if="user && !user.id"
      id="signUp"
      class="container--full-height container--blue padding-top--xxxlarge"
      :darkBg="true"
    />
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import user from "~/mixins/user.js";
import publicRecipes from "~/mixins/public-recipes.js";

import InitialInfoSection from "~/components/InitialInfoSection/InititalInfoSection.vue";
import SignUpSection from "~/components/SignUp/SignUpSection.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipeSearch from "~/components/Search/RecipeSearch.vue";

export default {
  name: "Home",
  layout: "fullwidth",
  components: {
    InitialInfoSection,
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
      filteredRecipes: [],
      filtered: false,
      searchOpen: false
    };
  },
  mixins: [user, publicRecipes],
  computed: {
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
