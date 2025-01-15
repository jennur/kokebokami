<template>
  <div class="container container--center">
    <BreadCrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom-lg">{{ headlineText }}</h1>
    <div
      v-click-outside="closeDropdown"
      class="container container--center add-recipe"
    >
      <button
        v-if="!addRecipeFromUrl"
        class="button button-lg button--round margin-auto margin-v-xl"
        @click="toggleDropdown"
      >
        {{ $t("navigation.addRecipe") }}
      </button>
      <transition name="pop-modal" tag="div">
        <div v-if="dropdown" class="add-recipe-dropdown">
          <NuxtLink
            :to="$localePath('/account/my-cookbook/add-recipe/')"
            class="add-recipe-dropdown_link"
            >{{ $t("navigation.addPersonalRecipe") }}</NuxtLink
          >
          <button @click="toggleRecipeForm" class="add-recipe-dropdown_link">
            {{ $t("navigation.addRecipeLink") }}
          </button>
        </div>
      </transition>
    </div>
    <!-- Add recipe from URL -->
    <expand-transition :show="addRecipeFromUrl">
      <add-recipe-from-url-form
        @cancel="toggleRecipeForm"
        @save="handleLinkSave"
      />
    </expand-transition>

    <!-- Recipes list -->
    <Tabs
      class="margin-top-xl"
      :tabTitles="[
        $t('myCookbook.tabs.myRecipes'),
        $t('myCookbook.tabs.myRecipeLinks'),
        $t('myCookbook.tabs.myFavorites')
      ]"
      :activeTabIndexControl="activeTabIndex"
      @switchTab="index => handleTabSwitch(index)"
    >
      <recipes-list
        v-if="activeTabIndex === 0 || activeTabIndex === 2"
        class="margin-top-lg padding-bottom-lg"
        :recipes="visibleRecipes"
        :isPublicList="activeTabIndex === 2"
        :emptyListMessage="emptyListMessage"
        :addRecipeUrl="activeTabIndex === 0 ? '/account/my-cookbook/add-recipe/' : ''"
      />
      <div v-if="activeTabIndex === 1">
        <recipe-link-list
          class="margin-top-2xl"
          :hiddenCategories="hiddenCategories"
          :links="recipeLinks"
          :emptyListMessage="emptyListMessage"
          @open-form="toggleRecipeForm"
          @update="getRecipeLinks"
        />
      </div>
    </Tabs>
  </div>
</template>

<script>
 

import user from "~/composables/user.js";
import favoriteRecipes from "~/mixins/user-favorites.js";
import userRecipes from "~/mixins/user-recipes.js";
import recipeLinks from "~/mixins/user-recipe-links.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import AddRecipeFromUrlForm from "~/components/AddRecipeForm/AddRecipeFromUrlForm.vue";
import Tabs from "~/components/Tabs.vue";
import RecipesList from "~/components/RecipePreview/RecipesList.vue";
import RecipeLinkList from "~/components/RecipeLinkList/RecipeLinkList.vue";

export default {
  name: "my-cookbook",
  head() {
    return {
      title: `My cookbook | Kokebokami`,
      meta: [
        {
          name: "robots" ,
          content: "noindex"
        }
      ],
      link: [
        {
          rel: "canonical",
          href: "https://kokebokami.com/account/my-cookbook/"
        }
      ]
    };
  },
  components: {
    ExpandTransition,
    AddRecipeFromUrlForm,
    Tabs,
    RecipesList,
    RecipeLinkList
  },
  data() {
    return {
      addingRecipe: false,
      activeTabIndex: 0,
      dropdown: false,
      addRecipeFromUrl: false,
      hiddenCategories: []
    };
  },
  mixins: [user, userRecipes, recipeLinks, favoriteRecipes],
  computed: {
    breadcrumbs() {
      return [
        { name: this.$t("navigation.home"), link: "/" },
        {
          name: this.$t("navigation.myAccount"),
          link: "/account/"
        },
        { name: this.$t("navigation.myCookbook") }
      ];
    },
    emptyListMessage() {
      if (this.activeTabIndex === 0)
        return "You didn´t add any recipes yet 👩‍🍳 Your personal recipes will appear in this list";
      else if (this.activeTabIndex === 1)
        return "You didnt add any recipes to this list yet. 🤷🏼‍♀️ The recipes you add from URL will appear in this list.";
      else if (this.activeTabIndex === 2)
        return "You didn't add any favorites yet! 🤷🏾‍♂️";
    },
    firstName() {
      let firstName = null;
      let user = this.user;
      if (user && user.displayName && user.displayName !== "User") {
        let username = user.displayName;
        firstName = /\s/.test(username) ? username.split(" ")[0] : username;
      }
      return firstName;
    },
    headlineText() {
      if (this.firstName) return `${this.firstName}'s kokebok`;
      else return "My kokebok";
    },
    visibleRecipes() {
      if (this.activeTabIndex === 0) return this.userRecipes;
      if (this.activeTabIndex === 2) return this.favoriteRecipes;
    },
    userCategories() {
      let links = this.recipeLinks;
      let categories = ["No category"];
      links.forEach(link => {
        if (link.category) {
          if (categories.indexOf(link.category) === -1)
            categories.push(link.category);
        }
      });
      categories.push(categories.shift());
      return categories;
    },
  },
  methods: {
    updateHiddenCategories(hiddenCategories) {
      this.hiddenCategories = hiddenCategories;
    },
    handleLinkSave() {
      this.getRecipeLinks();
      this.activeTabIndex = 1;
      this.addRecipeFromUrl = false;
    },
    closeDropdown() {
      this.dropdown = false;
    },
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },
    toggleRecipeForm() {
      this.addRecipeFromUrl = !this.addRecipeFromUrl;
      this.dropdown = false;
    },
    handleTabSwitch(index) {
      this.activeTabIndex = index;
    }
  },
  
};
</script>
