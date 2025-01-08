export const modalMutations = {

  showUsernameModal(state, payload) {
    state.showUsernameModal = payload;
  },

  showLoginModal(state, payload) {
    state.loginModal.open = payload.open;
    state.loginModal.headline = payload.headline;
  }
};
