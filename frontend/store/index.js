import allCategories from "~/helpers/all-categories";

export function state() {
  return {
    user: null,
    shoppingListCount: 0,
    loginSystemMessage: "",
    signupSystemMessage: "",
    allCategories
  };
}

export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setShoppingListCount(state, payload) {
    state.shoppingListCount = payload;
  },
  setLoginSystemMessage(state, payload) {
    state.loginSystemMessage = payload;
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
  SET_SHOPPING_LIST_COUNT: function({ commit }) {
    let authUser = this.$fire.auth.currentUser;
    this.$fire.database
      .ref("shoppingLists")
      .once("value", snapshot => {
        if(snapshot.exists()) {
          let shoppingLists = snapshot.val();
          let count = 0;

          for(let key in shoppingLists) {
            let shoppingList = shoppingLists[key];
            let owners = Object.values(shoppingList.owners);

            owners.forEach(owner => {
              if (owner.id === authUser.uid && shoppingList.subLists) {
                console.log("Setting count");
                let subLists = shoppingList.subLists;
                for(let subKey in subLists) {
                  if(subLists[subKey].listItems) {
                    count += subLists[subKey].listItems.length;
                  }
                }
              }
            });
          }
          commit("setShoppingListCount", count);
        }
      });
  },

  SET_USER: function({ commit, dispatch }) {
    try {
      let authUser = this.$fire.auth.currentUser;
      let userRef = this.$fire.database.ref(`users/${authUser.uid}`);

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
            following: snapshot.val().following,
            hiddenProfile: snapshot.val().hiddenProfile,
            notificationsOff: snapshot.val().notificationsOff || {
              recipes: false,
              shoppingLists: false,
              comments: false
            }
          };
        } else {
          let databaseUser = {
            displayName: authUser.displayName ? authUser.displayName : "User",
            photoURL: authUser.photoURL && authUser.photoURL,
            email: authUser.email,
            notificationsOff: {
              recipes: false,
              shoppingLists: false,
              comments: false
            }
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
      dispatch("SET_SHOPPING_LIST_COUNT");
    } catch (error) {
      console.log("Error while setting user:", error.message);
    }
  },

  REMOVE_USER: ({ commit }) => {
    commit("setUser", null);
  },

  USER_SIGN_OUT: function({ commit }) {
    try {
      this.$fire.auth.signOut().then(() => {
        commit("setUser", null);
        console.log("User logged out");
      });
    } catch (error) {
      console.log("Error removing user: " + error);
    }
  }
};
