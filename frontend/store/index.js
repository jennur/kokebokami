import { GoogleProvider, FacebookProvider, auth } from "~/plugins/firebase.js";

export const state = {
  user: null,
  systemMessage: null,
  recipes: [
    {
      id: "recipeno1",
      title: "The most boring omelette",
      description: `This is the simplest omelette you can possibly make.
      Although it does have flour`,
      ingredients: ["100 g flour", "3 eggs", "3 dl water"],
      instructions: `Mix everything together.
    Put inside oven.
    Bake for 3 hours.
    Enjoy!`
    },
    {
      id: "recipeno2",
      title: "Coconut tomatoes",
      description: `A dish for coconut and tomato lovers.
      If you also like water, it's your new favourite.`,
      ingredients: ["200 g coconut milk", "3 tomatoes", "3 dl water"],
      instructions: `Mix everything together.
    Fry in a big pan for 10 minutes.
    Enjoy!`
    },
    {
      id: "recipeno3",
      title: "Coconut tomatoes",
      description: `A dish for coconut and tomato lovers.
      If you also like water, it's your new favourite.`,
      ingredients: ["200 g coconut milk", "3 tomatoes", "3 dl water"],
      instructions: `Mix everything together.
    Fry in a big pan for 10 minutes.
    Enjoy!`
    }
  ]
};

console.log("STATE USER::: " + state.user);

export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  removeUser(state) {
    state.user = null;
  },
  setSystemMessage(state, payload) {
    state.systemMessage = payload;
  }
};

export const actions = {
  SET_USER: ({ commit }, user) => {
    commit("setUser", user);
  },
  GOOGLE_SIGN_IN: ({ commit }) => {
    auth
      .signInWithPopup(GoogleProvider)
      .then(response => {
        let user = {
          id: response.user.uid,
          profileImg: response.user.photoURL,
          name: response.user.displayName
        };
        commit("setUser", user);
      })
      .catch(e => {
        console.log(e);
      });
  },
  FACEBOOK_SIGN_IN: ({ commit }) => {
    auth
      .signInWithPopup(FacebookProvider)
      .then(response => {
        let user = {
          id: response.user.uid,
          profileImg: response.user.photoURL,
          name: response.user.displayName
        };
        commit("setUser", user);
      })
      .catch(e => {
        commit("setSystemMessage", e.message);
        console.log(e.message);
      });
  },
  USER_SIGN_OUT: ({ commit }) => {
    auth
      .signOut()
      .then(() => {
        commit("removeUser");
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export const getters = {
  user(state) {
    return state.user;
  },
  systemMessage(state) {
    return state.systemMessage;
  },
  recipes(state) {
    return state.recipes;
  }
};
