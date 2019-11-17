import {
  GoogleProvider,
  FacebookProvider,
  auth,
  db
} from "~/plugins/firebase.js";

export function state() {
  return {
    cookieConsent: false,
    user: null,
    allUsers: null,
    loginSystemMessage: "",
    recipes: [],
    sharedRecipes: [],
    publicRecipes: [],
    categories: [
      "breakfast",
      "lunch",
      "dinner",
      "dessert",
      "vegetarian",
      "vegan"
    ]
  };
}

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
  setAllUsers(state, payload) {
    state.allUsers = payload;
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
  SET_ALL_USERS: ({ commit }) => {
    let usersArray = [];
    db.ref("users").once("value", users => {
      users.forEach(user => {
        usersArray.push([user.key, user.val()]);
      });
      commit("setAllUsers", usersArray);
    });
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
        console.log("ERROR REMOVING USER:::" + error);
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

            if (shares.length) {
              shares.forEach(share => {
                if (share === user.id)
                  recipesArray.push([recipe.key, recipe.val()]);
              });
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
  allUsers(state) {
    return state.allUsers;
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
  },
  categories(state) {
    return state.categories;
  }
};
