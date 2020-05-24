export function state() {
  return {
    user: null,
    allUsers: [],
    userRecipes: [],
    sharedRecipes: [],
    publicRecipes: [],
    allRecipes: [],
    loginSystemMessage: "",
    signupSystemMessage: "",
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
  setUser(state, payload) {
    state.user = payload;
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
  setUserRecipes(state, payload) {
    state.userRecipes = payload;
  },
  setSharedRecipes(state, payload) {
    state.sharedRecipes = payload;
  },
  setPublicRecipes(state, payload) {
    state.publicRecipes = payload;
  },
  setAllRecipes(state, payload) {
    state.allRecipes = payload;
  }
};

export const actions = {
  ON_AUTH_STATE_CHANGED: function(context, { authUser, claims }) {
    if (authUser) {
      context.dispatch("SET_USER");
      /* context.dispatch("SET_ALL_USERS");
      context.dispatch("SET_USER_RECIPES", authUser);
      context.dispatch("SET_SHARED_RECIPES", authUser);
      context.dispatch("SET_PUBLIC_RECIPES");
      context.dispatch("SET_ALL_RECIPES"); */
    }
    this.$fireAuthUnsubscribe;
  },

  SET_LOGIN_MESSAGE: ({ commit }, payload) => {
    commit("setLoginSystemMessage", payload);
  },

  SET_USER: function({ commit }) {
    console.log("Setting user");
    try {
      let authUser = this.$fireAuth.currentUser;
      let userRef = this.$fireDb.ref("users/" + authUser.uid);
      userRef.once("value", snapshot => {
        let loggedinUser = {
          id: authUser.uid,
          emailVerified: authUser.emailVerified
        };
        if (snapshot.exists()) {
          loggedinUser = {
            ...loggedinUser,
            photoURL: snapshot.val().photoURL,
            displayName: snapshot.val().displayName,
            email: snapshot.val().email,
            biography: snapshot.val().biography,
            following: snapshot.val().following
          };
        } else {
          let databaseUser = {
            displayName: authUser.displayName ? authUser.displayName : "User",
            photoURL: authUser.photoURL && authUser.photoURL,
            email: authUser.email
            // No more details available upon first login
          };
          userRef.set(databaseUser);

          loggedinUser = {
            ...loggedinUser,
            photoURL: authUser.photoURL && authUser.photoURL,
            displayName: authUser.displayName && authUser.displayName,
            email: authUser.email
            // No more details available upon first login
          };
        }
        commit("setUser", loggedinUser);
      });
    } catch (error) {
      console.log("Error while setting user:", error);
    }
  },

  REMOVE_USER: ({ commit }) => {
    commit("setUser", null);
  },

  USER_SIGN_OUT: function({ commit }) {
    try {
      this.$fireAuth.signOut().then(() => {
        commit("setUser", null);
        console.log("User logged out");
      });
    } catch (error) {
      console.log("Error removing user: " + error);
    }
  },

  SET_ALL_USERS: function({ commit }) {
    try {
      this.$fireDb.ref("users").once("value", users => {
        if (users.exists()) {
          let allUsers = Object.entries(users.val());
          commit("setAllUsers", allUsers);
        }
      });
    } catch (error) {
      console.log("Error while loading allUsers:", error);
    }
  },

  SET_USER_RECIPES: function({ commit }, user) {
    try {
      let userRecipesRef = this.$fireDb.ref("recipes").orderByKey();
      userRecipesRef.once("value", recipes => {
        if (recipes.exists()) {
          recipes = Object.entries(recipes.val());
          let userRecipes = recipes.filter(recipe => {
            return recipe[1].ownerID === user.uid;
          });
          commit("setUserRecipes", userRecipes);
        }
      });
    } catch (error) {
      console.log("Error: Failed setting recipes:", error);
    }
  },

  SET_ALL_RECIPES: function({ commit }) {
    try {
      let allRecipesRef = this.$fireDb.ref("recipes").orderByKey();
      allRecipesRef.once("value", recipes => {
        if (recipes.exists()) {
          let allRecipes = Object.entries(recipes.val());
          commit("setAllRecipes", allRecipes);
        }
      });
    } catch (error) {
      console.log("Error: Failed setting recipes:", error);
    }
  },

  SET_SHARED_RECIPES: function({ commit }, user) {
    try {
      let sharedRecipesRef = this.$fireDb
        .ref("recipes")
        .orderByChild("sharedWith");
      sharedRecipesRef.once("value", recipes => {
        if (recipes.exists()) {
          recipes = Object.entries(recipes.val());
          let sharedRecipes = recipes.filter(recipe => {
            let shares = recipe[1].sharedWith
              ? Object.values(recipe[1].sharedWith)
              : [];
            if (shares.length) {
              return shares.indexOf(user.uid) > -1;
            }
            return false;
          });
          commit("setSharedRecipes", sharedRecipes);
        }
      });
    } catch (error) {
      console.log("Error: Failed to set shared recipes:", error);
    }
  },

  SET_PUBLIC_RECIPES: function({ commit }) {
    try {
      let publicRecipesRef = this.$fireDb.ref("recipes").orderByChild("public");
      publicRecipesRef.once("value", recipes => {
        if (recipes.exists()) {
          recipes = Object.entries(recipes.val());
          let publicRecipes = recipes.filter(recipe => {
            return recipe[1].public;
          });
          commit("setPublicRecipes", publicRecipes);
        }
      });
    } catch (error) {
      console.log(
        "Error: Something failed while trying to set public recipes:",
        error
      );
    }
  }
};
