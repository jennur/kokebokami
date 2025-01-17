import { defineStore } from "pinia";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { useMainStore, useRecipeStore, useShoppingListStore } from "..";
import userModel from "~/helpers/user-model";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    followers: [],
    followed: [],
    loginMessage: "",
    errorMessages: {
      connectedUsers: "",
    },
  }),

  getters: {
    userFavorites: (state) => {
      const recipeStore = useRecipeStore();
      const favoriteRecipes = [];

      const favoriteRecipeKeys = state.user.favorites;
      for (const key in recipeStore.recipes) {
        if (favoriteRecipeKeys.some((favoriteKey) => favoriteKey === key)) {
          const recipe = recipeStore.recipes[key];
          favoriteRecipes.push(recipeModel(recipe, key));
        }
      }

      return favoriteRecipes;
    },
  },
  actions: {
    LOGIN_SUCCESS: function () {
      const auth = getAuth();
      console.log("CURRENT USER:", auth.currentUser);
      if (auth.currentUser) {
        this.SET_USER();
        const mainStore = useMainStore();
        mainStore.SHOW_LOADING_SPLASH(false);
      }
    },
    UPDATE_USERNAME: function (username) {
      this.user.displayName = username;
    },

    UPDATE_USER_FAVORITES: async function () {
      const auth = getAuth();
      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, `users/${auth.currentUser.uid}/favorites`));

        if (snapshot.exists()) {
          this.user.favorites = snapshot.val();
        } else {
          this.user.favorites = null;
        }
      } catch (error) {
        console.error("[UPDATE_USER_FAVORITES]", error);
      }
    },
    SET_CONNECTED_USERS: function () {
      const auth = getAuth();
      if (this.user) {
        const db = getDatabase();
        get(ref(db, "users"))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const users = snapshot.val();
              const followers = [];
              const followed = [];

              for (const key in users) {
                const user = users[key];
                //If followed ...
                if (
                  user.following &&
                  Object.values(user.following).some(
                    (id) => id === this.user.id
                  )
                ) {
                  followers.push(userModel(user, key));
                }
                //If following ...
                if (
                  this.user.following &&
                  Object.values(this.user.following).some((id) => id === key)
                ) {
                  followed.push(userModel(user, key));
                }
              }
              this.followed = followed;
              this.followers = followers;
            }
          })
          .catch((error) => {
            console.error("[SET_CONNECTED_USERS]", error.message);
            this.errorMessages.connectedUsers =
              "Unable to load users. If the issue continues, please contact us.";
          });
      }
    },

    SET_USER: async function () {
      try {
        const db = getDatabase();
        const authUser = useCurrentUser();

        if (!authUser.value) throw Error("User is not authenticated");

        let loggedinUser = {
          id: authUser.value.uid,
          emailVerified: authUser.value.emailVerified,
        };

        const userRef = ref(db, `users/${authUser.value.uid}`);

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
            ...databaseUserData,
          };
        }

        this.user = loggedinUser;
        const shoppingListStore = useShoppingListStore()
        shoppingListStore.REFRESH();
        this.SET_CONNECTED_USERS();
      } catch (error) {
        console.error("[SET_USER]", error.message);
      }
    },

    REMOVE_USER: function () {
      this.user = null;
    },

    SIGN_OUT: async function () {
      const router = useRouter();
      const { $localePath } = useNuxtApp();
      try {
        const auth = getAuth();
        await signOut(auth);
        this.user = null;
        console.info("[SIGN_OUT] User logged out");
        router.push("/");
      } catch (error) {
        console.error("[SIGN_OUT]", error);
      }
    },
    SET_LOGIN_MESSAGE: function (message) {
      this.loginMessage = message;
    },
  },
});
