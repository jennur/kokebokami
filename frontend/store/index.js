import {
  GoogleProvider,
  FacebookProvider,
  auth,
  db
} from "~/plugins/firebase.js";

export const state = {
  user: null,
  systemMessage: null,
  recipes: []
};

export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  removeUser(state) {
    state.user = null;
  },
  setSystemMessage(state, payload) {
    state.systemMessage = payload;
  },
  setRecipes(state, payload) {
    state.recipes = payload;
  }
};

export const actions = {
  SET_USER: ({ commit }, user) => {
    commit("setUser", user);
  },
  GOOGLE_SIGN_IN: ({ commit }) => {
    auth
      .signInWithPopup(GoogleProvider)
      .then(response => {
        let user = {
          id: response.user.uid,
          profileImg: response.user.photoURL,
          name: response.user.displayName
        };
        commit("setUser", user);
      })
      .catch(e => {
        console.log(e);
      });
  },
  FACEBOOK_SIGN_IN: ({ commit }) => {
    auth
      .signInWithPopup(FacebookProvider)
      .then(response => {
        let user = {
          id: response.user.uid,
          profileImg: response.user.photoURL,
          name: response.user.displayName
        };
        commit("setUser", user);
      })
      .catch(e => {
        commit("setSystemMessage", e.message);
        console.log(e.message);
      });
  },
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
  user(state) {
    return state.user;
  },
  systemMessage(state) {
    return state.systemMessage;
  },
  recipes(state) {
    return state.recipes;
  }
};
