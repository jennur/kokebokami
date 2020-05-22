/* import {
  GoogleProvider,
  FacebookProvider,
  auth,
  db
} from "~/plugins/firebase.js"; */

import { auth } from "firebase-admin";

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
  /* acceptCookies(state) {
    state.cookieConsent = true;
  }, */
  onAuthStateChanged(state, { authUser, claims }) {
    console.log("AutStateChanged Mutation:", authUser, "Claims:", claims);
    if (!authUser) {
      // claims = null
      // Perform logout operations
      /* $fireAuth
        .signOut()
        .then(() => {
          state.user = null;
          console.log("Logged out");
        })
        .catch(error => {
          console.log("Error signing out from Firebase:", error);
        }); */
    } else {
      const { uid, email, emailVerified } = authUser;
      console.log("AuthUser:", authUser);

      // Do something with the authUser and the claims object...
    }
  },
  setUser(state, payload) {
    state.user = payload;
  },
  removeUser(state) {
    state.user = null;
  },
  /* setAllUsers(state, payload) {
    state.allUsers = payload;
  }, */
  setLoginSystemMessage(state, payload) {
    state.loginSystemMessage = payload;
  },
  setSignupSystemMessage(state, payload) {
    state.signupSystemMessage = payload;
  },
  /*  setRecipes(state, payload) {
    state.recipes = payload;
  }, */
  /* setSharedRecipes(state, payload) {
    state.sharedRecipes = payload;
  }, */
  setPublicRecipes(state, payload) {
    state.publicRecipes = payload;
  }
};

export const actions = {
  /* ACCEPT_COOKIES: ({ commit }) => {
    commit("acceptCookies");
  }, */
  ON_AUTH_STATE_CHANGED: function(context, { authUser, claims }) {
    console.log("User:", authUser);
    //let userRef = this.$fireDb.ref("users/" + authUser.uid);

    /* userRef.once("value", snapshot => {
      if (snapshot.exists()) {
        loggedinUser = {
          id: user.uid,
          photoURL: snapshot.val().photoURL,
          displayName: snapshot.val().displayName,
          email: snapshot.val().email,
          biography: snapshot.val().biography,
          following: snapshot.val().following,
          followers: snapshot.val().followers
        };
      } else {
        let databaseUser = {
          displayName: user.displayName ? user.displayName : "User",
          photoURL: user.photoURL && user.photoURL,
          email: user.email
          // No more details available upon first login
        };
        userRef.set(databaseUser);

        loggedinUser = {
          id: user.uid,
          photoURL: user.photoURL && user.photoURL,
          displayName: user.displayName && user.displayName,
          email: user.email
          // No more details available upon first login
        };
      }
      context.commit("setUser", loggedinUser);
    }); */
  },
  SET_LOGIN_MESSAGE: ({ commit }, payload) => {
    commit("setLoginSystemMessage", payload);
  },
  SET_USER: ({ commit }, user) => {
    commit("setUser", user);
  },
  REMOVE_USER: ({ commit }) => {
    commit("removeUser");
  }
  /* SET_ALL_USERS: ({ commit, $fireDb }) => {
    let usersArray = [];
    $fireDb.ref("users").once("value", users => {
      users.forEach(user => {
        usersArray.push([user.key, user.val()]);
      });
      commit("setAllUsers", usersArray);
    });
  }, */
  /* USER_SIGN_OUT: ({ commit, $fireAuth }) => {
    $fireAuth
      .signOut()
      .then(() => {
        commit("removeUser");
      })
      .catch(error => {
        console.log("Error removing user: " + error);
      });
  }, */
  /* SET_USER_RECIPES: ({ commit }, user) => {
    const recipesRef = $fireDb.ref("recipes").orderByKey();
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
  },*/
  /* SET_SHARED_RECIPES: async ({ commit }, user) => {
    const recipesRef = $fireDb.ref("recipes").orderByChild("sharedWith");
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
  }, */
  /*  SET_PUBLIC_RECIPES: ({ commit, $fireDb }) => {
    const recipesRef = $fireDb.ref("recipes").orderByChild("public");
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
  } */
};
