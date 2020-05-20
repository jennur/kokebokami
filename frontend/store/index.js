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
    signupSystemMessage: "",
    recipes: [],
    sharedRecipes: [],
    publicRecipes: [],
    allCategories: [
      {
        languages: [
          "English",
          "French",
          "German",
          "Hebrew",
          "Italian",
          "Norwegian",
          "Polish",
          "Spanish",

          "Arabic",
          "Dutch",
          "Hindi",
          "Japanese",
          "Korean",
          "Mandarin",
          "Portuguese",
          "Punjabi",
          "Russian",
          "Swahili",
          "Thai",
          "Turkish",
          "Vietnamese"
        ]
      },
      {
        typeOfMeal: [
          "breakfast",
          "lunch",
          "dinner",
          "side dish",
          "dessert",
          "baking",
          "snack",
          "drinks"
        ]
      },
      {
        allergens: [
          "nuts",
          "gluten",
          "dairy",
          "sugar",
          "eggs",
          "soy",
          "fish",
          "celery"
        ]
      },
      {
        categories: [
          "quick & easy",
          "comfort food",
          "spicy",
          "vegetarian",
          "vegan"
        ]
      }
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
  setSignupSystemMessage(state, payload) {
    state.signupSystemMessage = payload;
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
  SET_LOGIN_MESSAGE: ({ commit }, payload) => {
    commit("setLoginSystemMessage", payload);
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
  KOKEBOKAMI_SIGN_UP: ({ commit }, credentials) => {
    auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        response.user
          .sendEmailVerification()
          .then(() => {
            console.log("Verification email sent");
          })
          .catch(error => {
            console.log("Error sending verification email:", error);
          });
      })
      .catch(function(error) {
        commit("setSignupSystemMessage", error.message);
        console.log(
          "Failed with error code: " + error.code + " " + error.message
        );
      });
  },
  USER_SIGN_OUT: ({ commit }) => {
    auth
      .signOut()
      .then(() => {
        commit("removeUser");
      })
      .catch(error => {
        console.log("Error removing user: " + error);
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
          "Error: Something failed when attempting to set recipes: " + error
        );
      }
    );
  },
  SET_SHARED_RECIPES: async ({ commit }, user) => {
    const recipesRef = db.ref("recipes").orderByChild("sharedWith");
    let recipesArray = [];
    await recipesRef.once(
      "value",
      recipes => {
        recipes.forEach(recipe => {
          if (recipe.exists()) {
            const shares = recipe.val().sharedWith
              ? Object.values(recipe.val().sharedWith)
              : [];
            if (shares.length) {
              shares.forEach(share => {
                if (share === user.id) {
                  recipesArray.push([recipe.key, recipe.val()]);
                }
              });
            }
          }
        });
      },
      error => {
        console.log(
          "Error: Something failed when attempting to set shared recipes: " +
            error
        );
      }
    );
    commit("setSharedRecipes", recipesArray);
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
          "Error: Something failed when attempting to set public recipes: " +
            error
        );
      }
    );
  }
};
