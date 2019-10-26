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
  recipes: []
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
  }
};
