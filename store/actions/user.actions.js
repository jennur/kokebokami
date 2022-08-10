export const userActions = {

  ON_AUTH_STATE_CHANGED: function(context, { authUser, claims }) {
    if (authUser) {
      context.dispatch("SET_USER");
      context.dispatch("SHOW_LOADING_SPLASH", false);
    }
    this.$fireAuthUnsubscribe;
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
