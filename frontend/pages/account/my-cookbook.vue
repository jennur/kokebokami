<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom--large">{{ headlineText }}</h1>
    <div
      v-click-outside="closeDropdown"
      class="container container--center add-recipe"
    >
      <button
        v-if="!addRecipeFromUrl"
        class="button button--large button--round margin--auto margin-vertical--xlarge"
        @click="toggleDropdown"
      >
        Add new recipe
      </button>
      <transition name="pop-modal" tag="div">
        <div v-if="dropdown" class="add-recipe-dropdown">
          <nuxt-link to="/account/add-recipe/" class="add-recipe-dropdown__link"
            >Add personal recipe</nuxt-link
          >
          <button @click="toggleRecipeForm" class="add-recipe-dropdown__link">
            Add recipe link
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
      :tabTitles="[
        'My personal recipes',
        'My recipe links',
        'Recipes shared with me'
      ]"
      :activeTabIndexControl="activeTabIndex"
      @switchTab="index => handleTabSwitch(index)"
    >
      <!-- <div class="container" v-if="activeTabIndex === 0 || activeTabIndex === 2">
        <recipes-filter
          class="margin-bottom--xlarge margin--auto"
          :recipes="recipesToBeFiltered"
          @filter="setVisibleRecipes"
        />
      </div> -->
      <recipes-list
        v-if="activeTabIndex === 0 || activeTabIndex === 2"
        class="margin-top--large padding-bottom--large"
        :recipes="visibleRecipes"
        :publicRecipe="activeTabIndex === 2"
        :emptyListMessage="emptyListMessage"
        :addRecipeUrl="activeTabIndex === 0 ? '/account/add-recipe/' : ''"
      />
      <div v-if="activeTabIndex === 1">
        <user-categories-filter
          v-if="userRecipeLinks.length"
          :categories="userCategories"
          @updateCategories="
            hiddenCategories => updateHiddenCategories(hiddenCategories)
          "
        />
        <recipes-link-list
          class="margin-top--xxlarge"
          :hiddenCategories="hiddenCategories"
          :links="userRecipeLinks"
          :emptyListMessage="emptyListMessage"
          @openForm="toggleRecipeForm"
          @update="updateLinkList"
        />
      </div>
    </Tabs>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

import user from "~/mixins/user.js";
import sharedRecipes from "~/mixins/sharedRecipes.js";
import userRecipes from "~/mixins/userRecipes.js";
import userRecipeLinks from "~/mixins/userRecipeLinks.js";

import ExpandTransition from "~/components/Transitions/Expand.vue";
import AddRecipeFromUrlForm from "~/components/Recipes/AddRecipeForm/AddRecipeFromUrlForm.vue";
import Tabs from "~/components/Tabs.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipesLinkList from "~/components/Recipes/RecipesLinkList.vue";
import RecipesFilter from "~/components/Filter/RecipesFilter.vue";
import UserCategoriesFilter from "~/components/Filter/UserCategoriesFilter.vue";

export default {
  name: "my-cookbook",
  head() {
    return {
      title: `My cookbook | Kokebokami`,
      link: [
        {
          rel: "canonical",
          href: "https://www.kokebokami.com/account/my-cookbook/"
        }
      ]
    };
  },
  components: {
    ExpandTransition,
    AddRecipeFromUrlForm,
    Tabs,
    RecipesList,
    RecipesLinkList,
    RecipesFilter,
    UserCategoriesFilter
  },
  data() {
    return {
      addingRecipe: false,
      filteredRecipes: [],
      filtered: false,
      filteredKind: "",
      activeTabIndex: 0,
      dropdown: false,
      addRecipeFromUrl: false,
      hiddenCategories: []
    };
  },
  mixins: [user, userRecipes, userRecipeLinks, sharedRecipes],
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [
        { name: "Home", link: "/" },
        { name: "My account", link: "/account/" },
        { name: "My cookbook" }
      ]
    }
  },
  computed: {
    emptyListMessage() {
      if (this.activeTabIndex === 0)
        return "You didn´t add any recipes yet 👩‍🍳 Your personal recipes will appear in this list";
      else if (this.activeTabIndex === 1)
        return "You didnt add any recipes to this list yet. 🤷🏼‍♀️ The recipes you add from URL will appear in this list.";
      else if (this.activeTabIndex === 2)
        return "Nobody shared any recipes with you yet 🤷🏾‍♂️";
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
      if (!this.filtered) {
        if (this.activeTabIndex === 0) return this.userRecipes;
        if (this.activeTabIndex === 2) return this.sharedRecipes;
      } else {
        return this.filteredRecipes;
      }
    },
    userCategories() {
      let links = this.userRecipeLinks;
      let categories = ["No category"];
      links.forEach(link => {
        if (link[1].category) {
          if (categories.indexOf(link[1].category) === -1)
            categories.push(link[1].category);
        }
      });
      categories.push(categories.shift());
      return categories;
    },
    recipesToBeFiltered() {
      if (this.activeTabIndex === 0) {
        return this.userRecipes;
      } else if (this.activeTabIndex === 2) {
        return this.sharedRecipes;
      }
    }
  },
  methods: {
    updateHiddenCategories(hiddenCategories) {
      this.hiddenCategories = hiddenCategories;
    },
    updateLinkList() {
      this.getRecipeLinks();
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
      this.filtered = false;
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
