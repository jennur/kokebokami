import { defineStore } from "pinia";
import { getDatabase, ref as dbRef, get, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import recipeModel from "../../helpers/recipe-model";
import allCategories from "~/helpers/all-categories";
import { useAuthStore } from "../";

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    recipes: [],
    userLinks: [],
    loaded: false,
    allCategories,
    errorMessage: null,
  }),
  getters: {
    publicRecipes: function (state) {
      const filterCondition = (recipe, key) => recipe.public;
      return this.FILTER_RECIPES(filterCondition);
    },
    userRecipes: function (state) {
      const auth = getAuth();
      const filterCondition = (recipe, key) =>
        recipe.ownerID === auth.currentUser.uid;
      return this.FILTER_RECIPES(filterCondition);
    },
    userSharedRecipes: function (state) {
      const auth = getAuth();
      const filterCondition = (recipe, key) =>
        recipe.sharedWith &&
        Object.values(recipe.sharedWith).some(
          (id) => id === auth.currentUser.uid
        );
      return this.FILTER_RECIPES(filterCondition);
    },
    userFavorites: function (state) {
      const authStore = useAuthStore();
      const favoriteKeys = Object.values(authStore.user.favorites);
      const filterCondition = (recipe, key) =>
        favoriteKeys.some((favoriteKey) => favoriteKey === key);
      return this.FILTER_RECIPES(filterCondition);
    },
  },
  actions: {
    SET_RECIPES: function (recipes, loaded, errorMessage) {
      this.recipes = recipes;
      this.loaded = loaded;
      this.errorMessage = errorMessage;
    },
    FILTER_RECIPES: function (condition) {
      const filteredRecipes = [];
      if (this.recipes) {
        for (const key in this.recipes) {
          const recipe = this.recipes[key];
          if (condition(recipe, key)) {
            filteredRecipes.push(recipeModel(recipe, key));
          }
        }
      }
      return filteredRecipes;
    },
    REFRESH_USER_LINKS: function () {
      const db = getDatabase();
      const auth = getAuth();

      if (auth.currentUser) {
        get(dbRef(db, `users/${auth.currentUser.uid}/recipeLinks`))
          .then((snapshot) => {
            const userLinks = [];
            if (snapshot.val()) {
              const links = snapshot.val();
              for (const key in links) {
                const link = links[key];
                link.id = key;
                link.title = link.title || this.makeBackupTitle(link);
                userLinks.push(link);
              }
            }
            this.userLinks = userLinks;
          })
          .catch((error) => {
            console.error("[REFRESH_USER_LINKS]", error.message);
          });
      }
    },
    makeBackupTitle(link) {
      let regex = /-/gi;
      let url = link.url;
      let title = url.split("/").pop().replace(regex, " ");
      return title;
    },
  },
});
