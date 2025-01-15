import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { useCurrentUser } from 'vuefire'
import { getAuth, signOut } from 'firebase/auth'
import { useMainStore } from "..";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loginMessage: "",
  }),

  actions: {
    LOGIN_SUCCESS: function() {
      const currentUser = useCurrentUser();
      console.log("CURRENT USER:", currentUser.value);
      if(currentUser.value) {
        this.SET_USER();
        const mainStore = useMainStore();
        mainStore.SHOW_LOADING_SPLASH(false);
      }
    },
    UPDATE_USERNAME: function (username) {
      this.user.displayName = username;
    },

    UPDATE_USER_FAVORITES: async function() {
      const authUser = useCurrentUser();
      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, `users/${authUser.uid}/favorites`));

        if (snapshot.exists()) {
          this.user.favorites = snapshot.val();
        } else {
          this.user.favorites = null;
        }
      } catch(error) {
        console.error("[UPDATE_USER_FAVORITES]", error);
      }
    },

    SET_USER: async function() {
      try {
        const db = getDatabase();
        const authUser = useCurrentUser();
        
        if (!authUser) throw Error("User is not authenticated");

        let loggedinUser = {
          id: authUser.uid,
          emailVerified: authUser.emailVerified,
        };
        
        const userRef = ref(db, `users/${authUser.uid}`);

        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
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
              comments: false,
            },
          };
        } else {
          // It's the first time the user is logging in, setting available data:
          const databaseUserData = {
            displayName: authUser?.displayName || "User",
            photoURL: authUser?.photoURL,
            email: authUser.email,
            notificationsOff: {
              recipes: false,
              shoppingLists: false,
              comments: false,
            },
          };

          if (authUser.emailVerified) {
            set(userRef, databaseUserData);
          }

          loggedinUser = {
            ...loggedinUser,
            ...databaseUserData
          };
        }

        this.user = loggedinUser;
        // SET_SHOPPING_LIST_COUNT
      } catch (error) {
        console.error("[SET_USER]", error.message);
      }
    },

    REMOVE_USER: function() {
      this.user = null;
    },

    USER_SIGN_OUT: async function () {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.user = null;
        console.info("[USER_SIGN_OUT] User logged out");
      } catch (error) {
        console.error("[USER_SIGN_OUT]", error);
      }
    },
    SET_LOGIN_MESSAGE: function(message) {
      this.loginMessage = message;
    }
  }
});
