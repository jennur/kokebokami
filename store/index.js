import { defineStore } from "pinia";
import { useAuthStore } from "./authStore"
import { useShoppingListStore } from "./shoppingListStore"
import { useRecipeStore } from "./recipeStore";

import allCategories from "~/helpers/all-categories";

const useMainStore = defineStore('main', {
  
  state: () => {
    return {
      allCategories,
      showLoadingSplash: false
    };
  },
  
  actions: {
    SHOW_LOADING_SPLASH: function(payload) {
      this.showLoadingSplash = payload;
    },
  }
});

export { useMainStore, useAuthStore, useShoppingListStore, useRecipeStore };