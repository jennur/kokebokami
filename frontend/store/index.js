import {
  GoogleProvider,
  FacebookProvider,
  auth,
  db
} from "~/plugins/firebase.js";

export const state = {
  cookieConsent: false,
  user: null,
  loginSystemMessage: "",
  recipes: [],
  sharedRecipes: [],
  publicRecipes: []
};

export const mutations = {
  acceptCookies(state) {
    state.cookieConsent = true;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  removeUser(state) {
    state.user = null;
  },
  setLoginSystemMessage(state, payload) {
    state.loginSystemMessage = payload;
  },
  setRecipes(state, payload) {
    state.recipes = payload;
  },
  setSharedRecipes(state, payload) {
    state.sharedRecipes = payload;
  },
  setPublicRecipes(state, payload) {
    state.publicRecipes = payload;
  }
};

export const actions = {
  ACCEPT_COOKIES: ({ commit }) => {
    commit("acceptCookies");
  },
  SET_USER: ({ commit }, user) => {
    commit("setUser", user);
  },
  REMOVE_USER: ({ commit }) => {
    commit("removeUser");
  },
  GOOGLE_SIGN_IN: () => {
    auth.signInWithRedirect(GoogleProvider);
  },
  FACEBOOK_SIGN_IN: () => {
    auth.signInWithRedirect(FacebookProvider);
  },
  KOKEBOKAMI_SIGN_IN: (email, password) => {},
  USER_SIGN_OUT: ({ commit }) => {
    auth
      .signOut()
      .then(() => {
        commit("removeUser");
      })
      .catch(error => {
        console.log(error);
      });
  },
  SET_USER_RECIPES: ({ commit }, user) => {
    const recipesRef = db.ref("recipes").orderByKey();
    let recipesArray = [];
    recipesRef.once(
      "value",
      recipes => {
        recipes.forEach(recipe => {
          if (recipe.val().ownerID === user.id)
            recipesArray.push([recipe.key, recipe.val()]);
        });
        commit("setRecipes", recipesArray);
      },
      error => {
        console.log(
          "Something failed when attempting to set recipes: " + error
        );
      }
    );
  },
  SET_SHARED_RECIPES: ({ commit }, user) => {
    const recipesRef = db.ref("recipes").orderByChild("sharedWith");
    let recipesArray = [];
    recipesRef.once(
      "value",
      recipes => {
        recipes.forEach(recipe => {
          if (recipe.exists()) {
            const shares = recipe.val().sharedWith
              ? recipe.val().sharedWith
              : [];
            if (shares.indexOf(user.id) !== -1) {
              recipesArray.push([recipe.key, recipe.val()]);
            }
          }
        });
        commit("setSharedRecipes", recipesArray);
      },
      error => {
        console.log(
          "Something failed when attempting to set shared recipes: " + error
        );
      }
    );
  },
  SET_PUBLIC_RECIPES: ({ commit }) => {
    const recipesRef = db.ref("recipes").orderByChild("public");
    let recipesArray = [];
    recipesRef.once(
      "value",
      recipes => {
        recipes.forEach(recipe => {
          if (recipe.exists()) {
            if (recipe.val().public) {
              recipesArray.push([recipe.key, recipe.val()]);
            }
          }
        });
        commit("setPublicRecipes", recipesArray);
        console.log("PUBLIC RECIPES SET::: " + JSON.stringify(recipesArray[0]));
      },
      error => {
        console.log(
          "Something failed when attempting to set public recipes: " + error
        );
      }
    );
  }
};

export const getters = {
  cookieConsent(state) {
    return state.cookieConsent;
  },
  user(state) {
    return state.user;
  },
  loginSystemMessage(state) {
    return state.loginSystemMessage;
  },
  recipes(state) {
    return state.recipes;
  },
  sharedRecipes(state) {
    return state.sharedRecipes;
  },
  publicRecipes(state) {
    return state.publicRecipes;
  }
};
