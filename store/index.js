import { defineStore } from "pinia";
import { useAuthStore } from "./authStore"
import { useShoppingListStore } from "./shoppingListStore"
import { useRecipeStore } from "./recipeStore";


const useMainStore = defineStore('main', {
  
  state: () => {
    return {
      showLoadingSplash: false,
      loginModal: {
        open: false,
        headline: "Login"
      }
    };
  },
  
  actions: {
    SHOW_LOADING_SPLASH: function(payload) {
      this.showLoadingSplash = payload;
    },
    SHOW_LOGIN_MODAL: function({ open, headline }) {
      this.loginModal.open = open;
      this.loginModal.headline = headline;
    }
  }
});

export { useMainStore, useAuthStore, useShoppingListStore, useRecipeStore };