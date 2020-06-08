<template>
  <div class="container container--center">
    <breadcrumbs :routes="breadcrumbs" />
    <h1 class="margin-bottom--large">{{ headlineText }}</h1>
    <div v-click-outside="closeDropdown" class="container container--center add-recipe">
      <button
        v-if="!addRecipeFromUrl"
        class="button button--large button--round margin--auto margin-vertical--xlarge"
        @click="toggleDropdown"
      >Add new recipe</button>
      <transition name="pop-modal" tag="div">
        <div v-if="dropdown" class="add-recipe-dropdown">
          <nuxt-link to="/account/add-recipe/" class="add-recipe-dropdown__link">Add personal recipe</nuxt-link>
          <button @click="toggleRecipeForm" class="add-recipe-dropdown__link">Add recipe link</button>
        </div>
      </transition>
    </div>
    <!-- Add recipe from URL -->
    <expand-transition :show="addRecipeFromUrl">
      <add-recipe-from-url-form @cancel="toggleRecipeForm" @save="handleLinkSave" />
    </expand-transition>
    <!-- Recipe list -->
    <Tabs
      :tabTitles="[
        'My personal recipes',
        'My recipe links',
        'Recipes shared with me'
      ]"
      :activeTabIndexControl="activeTabIndex"
      @switchTab="index => handleTabSwitch(index)"
    >
      <div class="container" v-if="activeTabIndex === 0 || activeTabIndex === 2">
        <recipes-filter
          class="margin-bottom--xlarge margin--auto"
          :recipes="recipesToBeFiltered"
          @filter="setVisibleRecipes"
        />
      </div>
      <recipes-list
        v-if="activeTabIndex === 0 || activeTabIndex === 2"
        class="margin-top--large padding-bottom--large"
        :recipes="visibleRecipes"
        :publicRecipe="activeTabIndex === 2"
        :emptyListMessage="emptyListMessage"
        :addRecipeUrl="activeTabIndex === 0 ? '/account/add-recipe/' : ''"
      />

      <div v-if="activeTabIndex === 1">
        <link-categories-filter
          v-if="userRecipeLinks.length"
          :links="userRecipeLinks"
          @updateCategories="event => updateVisibleCategories(event)"
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
import AddRecipeFromUrlForm from "~/components/AddRecipeForm/AddRecipeFromUrlForm.vue";
import Tabs from "~/components/Tabs.vue";
import RecipesList from "~/components/Recipes/RecipesList.vue";
import RecipesLinkList from "~/components/Recipes/RecipesLinkList.vue";
import RecipesFilter from "~/components/RecipesFilter/RecipesFilter.vue";
import LinkCategoriesFilter from "~/components/RecipesFilter/LinkCategoriesFilter.vue";
export default {
  name: "my-cookbook",
  components: {
    ExpandTransition,
    AddRecipeFromUrlForm,
    Tabs,
    RecipesList,
    RecipesLinkList,
    RecipesFilter,
    LinkCategoriesFilter
  },
  data() {
    return {
      addingRecipe: false,
      showMyRecipes: true,
      showSharedRecipes: false,
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
      default: () => [{ name: "Home", link: "/" }, { name: "My cookbook" }]
    }
  },
  computed: {
    emptyListMessage() {
      if (this.activeTabIndex === 0)
        return "You didn´t add any recipes yet 👩‍🍳 Your personal recipes will appear in this list";
      else if (this.activeTabIndex === 1)
        return "You didnt add any recipes to this list yet. 🤷🏼‍♀️ The recipes you add from URL will appear in this list.";
      else if (this.activeTabIndex === 2)
        return "Nobody shared any recipes with you yet 🤷🏾‍♂️ Tip: You can share public recipes with yourself if you want them easily accessible from your profile.";
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
      if (this.activeTabIndex === 0) {
        if (!this.filtered) return this.userRecipes;
        if (this.filtered && this.filteredKind === "myRecipes")
          return this.filteredRecipes;
        else if (this.filtered && this.filteredKind === "sharedRecipes")
          return this.userRecipes;
      } else if (this.activeTabIndex === 2) {
        if (!this.filtered) return this.sharedRecipes;
        if (this.filtered && this.filteredKind === "sharedRecipes")
          return this.filteredRecipes;
        else if (this.filtered && this.filteredKind === "myRecipes")
          return this.sharedRecipes;
      }
    },
    recipesToBeFiltered() {
      if (this.showMyRecipes) {
        return this.userRecipes;
      } else if (this.showSharedRecipes) {
        return this.sharedRecipes;
      }
    }
  },
  methods: {
    updateLinkList() {
      this.getRecipeLinks();
    },
    updateVisibleCategories(event) {
      let indexOfTargetValue = this.hiddenCategories.indexOf(
        event.target.value
      );
      if (indexOfTargetValue > -1) {
        this.hiddenCategories.splice(indexOfTargetValue, 1);
      } else {
        this.hiddenCategories.push(event.target.value);
      }
    },
    handleLinkSave() {
      this.getRecipeLinks();
      this.activeTabIndex = 1;
      this.addRecipeFromUrl = false;
      console.log("ActiveTab:", this.activeTabIndex);
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
    },
    toggleRecipes(event) {
      if (event.target.id === "my-cookbook-tab" && !this.showMyRecipes) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
      } else if (
        event.target.id === "shared-recipes-tab" &&
        !this.showSharedRecipes
      ) {
        this.showMyRecipes = !this.showMyRecipes;
        this.showSharedRecipes = !this.showSharedRecipes;
      }
    },
    setVisibleRecipes(filteredRecipesObj) {
      this.filteredRecipes = filteredRecipesObj.recipes;
      this.filtered = filteredRecipesObj.filtered;
      if (this.showMyRecipes) this.filteredKind = "myRecipes";
      if (this.showSharedRecipes) this.filteredKind = "sharedRecipes";
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
