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
  }
};

export const actions = {
  ON_AUTH_STATE_CHANGED: function(context, { authUser, claims }) {
    if (authUser) {
      context.dispatch("SET_USER");
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
  }
};
