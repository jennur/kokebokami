import allCategories from "~/helpers/all-categories";

export function state() {
  return {
    showLoadingSplash: false,
    user: null,
    shoppingListCount: 0,
    loginSystemMessage: "",
    signupSystemMessage: "",
    allCategories,
    showUsernameModal: false,
    loginModal: {
      open: false,
      headline: null
    }
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
  },
  showUsernameModal(state, payload) {
    state.showUsernameModal = payload;
  },
  updateUsername(state, payload) {
    state.user.displayName = payload;
    state.showUsernameModal = false;
  },
  updateUserFavorites(state, payload) {
    state.user.favorites = payload;
  },
  showLoginModal(state, payload) {
    state.loginModal.open = payload.open;
    state.loginModal.headline = payload.headline;
  },
  showLoadingSplash(state, payload) {
    state.showLoadingSplash = payload;
  }
};

export const actions = {
  SHOW_LOGIN_MODAL: ({commit}, payload) => {
    commit("showLoginModal", payload);
  },
  SHOW_LOADING_SPLASH: ({commit}, payload) => {
    commit("showLoadingSplash", payload);
  },
  ON_AUTH_STATE_CHANGED: function(context, { authUser, claims }) {
    if (authUser) {
      context.dispatch("SET_USER");
      context.dispatch("SHOW_LOADING_SPLASH", false);
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
  UPDATE_USERNAME: function({commit}, payload) {
    commit("updateUsername", payload);
  },
  UPDATE_USER_FAVORITES: function({commit}) {
    let authUser = this.$fire.auth.currentUser;

    this.$fire.database
      .ref(`users/${authUser.uid}/favorites`)
      .once("value", snapshot => {
        if(snapshot.exists()){
          commit("updateUserFavorites", snapshot.val());
        } else {
          commit("updateUserFavorites", null);
        }
      })
      .catch(error => console.log("Error updating user favorites", error));
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
          if(snapshot.val().displayName === "User") {
            commit("showUsernameModal", true);
          }
          loggedinUser = {
            ...loggedinUser,
            photoURL: snapshot.val().photoURL,
            displayName: snapshot.val().displayName,
            email: snapshot.val().email,
            biography: snapshot.val().biography,
            following: snapshot.val().following,
            hiddenProfile: snapshot.val().hiddenProfile,
            favorites: snapshot.val().favorites,
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

          if(authUser.emailVerified) {
            commit("showUsernameModal", true);
            userRef.set(databaseUser);
          }

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
