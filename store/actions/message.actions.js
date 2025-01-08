export const messageActions = {

  SHOW_LOADING_SPLASH: ({commit}, payload) => {
    commit("showLoadingSplash", payload);
  },

  SET_LOGIN_MESSAGE: ({ commit }, payload) => {
    commit("setLoginSystemMessage", payload);
  }
};
