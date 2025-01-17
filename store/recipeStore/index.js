import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { useCurrentUser } from "vuefire";
import { getAuth } from "firebase/auth";
import recipeModel from "../../helpers/recipe-model";
import allCategories from "~/helpers/all-categories";
import { useAuthStore } from "../";

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    recipes: [],
    loaded: false,
    allCategories,
    errorMessage: null,
  }),
  getters: {
    publicRecipes: function (state) {
      const filterCondition = (recipe) => recipe.public;
      return this.FILTER_RECIPES(filterCondition);
    },
    userRecipes: function (state) {
      const auth = getAuth();
      const filterCondition = (recipe) => (recipe.ownerID === auth.currentUser.uid)
      return this.FILTER_RECIPES(filterCondition);
    },
    userSharedRecipes: function (state) {
      const auth = getAuth();
      const filterCondition = (recipe) => (recipe.sharedWith && Object.values(recipe.sharedWith).some(
        (id) => id === auth.currentUser.uid
      ))
      return this.FILTER_RECIPES(filterCondition);
    },
  },
  actions: {
    SET_RECIPES: function (recipes, loaded, errorMessage) {
      this.recipes = recipes;
      this.loaded = loaded;
      this.errorMessage = errorMessage;
    },
    FILTER_RECIPES: function(condition) {
      const filteredRecipes = [];
      if (this.recipes) {
        for (const key in this.recipes) {
          const recipe = this.recipes[key];
          if (condition(recipe)) {
            filteredRecipes.push(recipeModel(recipe, key));
          }
        }
      }
      return filteredRecipes;
  
  }
  },
});
