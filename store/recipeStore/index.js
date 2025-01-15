import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { useCurrentUser } from 'vuefire'
import recipeModel from "../../helpers/recipe-model";

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    recipes: [],
    loaded: false,
    errorMessage: null
  }),
  getters: {
    publicRecipes: (state) => {
      const filteredRecipes = [];
      if (state.recipes) {    
        for (const key in state.recipes) {
          const recipe = state.recipes[key];
          if (recipe.public) {
            filteredRecipes.push(recipeModel(recipe, key));
          }
        }
      }
      return filteredRecipes;
    },
    userRecipes: (state) => {
      let filteredRecipes = [];
      if (state.recipes) {    
        for (let key in state.recipes) {
          const recipe = state.recipes[key];
          const { currentUser } = useCurrentUser();
          if(recipe.ownerID === currentUser.uid) {
            filteredRecipes.push(recipeModel(recipe, key))
          }
        }
      }
      return filteredRecipes;
    }
  },
  actions: {
    SET_RECIPES: function (recipes, loaded, errorMessage) {
      this.recipes = recipes;
      this.loaded = loaded;
      this.errorMessage = errorMessage;
    },
  }
});